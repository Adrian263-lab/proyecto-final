<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // Añadido para debugear si falla

class AnimalController extends Controller
{
    public function index()
    {
        $animales = Animal::with(['especie', 'user'])->get();
        return response()->json($animales);
    }

    public function show($id)
    {
        try {
            $animal = Animal::with(['especie', 'user'])->findOrFail($id);
            return response()->json($animal);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Animal no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error interno: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        if ($request->user()->rol !== 'protectora' || !$request->user()->validado) {
            return response()->json(['message' => 'No autorizado o no validado'], 403);
        }

        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'especie_id'  => 'required|exists:especies,id',
            'estado'      => 'required|string|max:100',
            'raza'        => 'nullable|string|max:255',
            'sexo'        => 'required|in:Macho,Hembra',
            'descripcion' => 'nullable|string',
            'imagen'      => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except('imagen'); 
        $animal = $request->user()->animales()->create($data);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('animales', 'public');
            $animal->imagen_url = asset('storage/' . $path);
            $animal->save();
        }

        return response()->json([
            'message' => 'Animal creado correctamente',
            'data' => $animal->load('especie') 
        ], 201);
    }

    /**
     * Actualizar animal - VERSIÓN CORREGIDA
     */
    public function update(Request $request, $id)
    {
        try {
            $animal = Animal::findOrFail($id);

            // Verificar propiedad
            if ($animal->user_id !== Auth::id()) {
                return response()->json(['message' => 'No autorizado'], 403);
            }

            // Validación
            $validatedData = $request->validate([
                'nombre'      => 'required|string|max:255',
                'especie_id'  => 'required|exists:especies,id',
                'estado'      => 'required|string',
                'sexo'        => 'required|in:Macho,Hembra',
                'raza'        => 'nullable|string|max:255',
                'descripcion' => 'nullable|string',
                'imagen'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            // Manejo de imagen
            if ($request->hasFile('imagen')) {
                // Borrar anterior si existe
                if ($animal->imagen_url) {
                    $oldPath = str_replace(asset('storage/'), '', $animal->imagen_url);
                    Storage::disk('public')->delete($oldPath);
                }
                $path = $request->file('imagen')->store('animales', 'public');
                $animal->imagen_url = asset('storage/' . $path);
            }

            // Actualizar solo los campos de la base de datos
            // Usamos $request->only para ignorar el campo '_method' que envía React
            $animal->update($request->only([
                'nombre', 'especie_id', 'estado', 'sexo', 'raza', 'descripcion'
            ]));
            
            $animal->save();

            return response()->json([
                'message' => 'Actualizado correctamente', 
                'data' => $animal->load('especie')
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error en update animal: " . $e->getMessage());
            return response()->json(['message' => 'Error en el servidor', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);

        if ($animal->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($animal->imagen_url) {
            $path = str_replace(asset('storage/'), '', $animal->imagen_url);
            Storage::disk('public')->delete($path);
        }

        $animal->delete();
        return response()->json(['message' => 'Eliminado']);
    }

    public function misAnimales(Request $request)
    {
        $animales = Animal::where('user_id', $request->user()->id)
                          ->with('especie')
                          ->get();
        return response()->json($animales);
    }
}