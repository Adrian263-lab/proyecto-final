<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Animal;
use App\Models\Adopcion; // Asegúrate de importar el modelo Adopcion
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AnimalController extends Controller
{
    public function index()
    {
        return response()->json(Animal::with(['especie', 'user'])->get());
    }

    public function show($id)
    {
        return response()->json(Animal::with(['especie', 'user'])->findOrFail($id));
    }

    public function store(Request $request)
    {
        if ($request->user()->rol !== 'protectora' || !$request->user()->validado) {
            return response()->json(['message' => 'No autorizado o no validado'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'especie_id' => 'required|exists:especies,id',
            'estado' => 'required|string|max:100',
            'sexo' => 'required|in:Macho,Hembra',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $animal = $request->user()->animales()->create($request->except('imagen'));

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('animales', 'public');
            $animal->update(['imagen_url' => asset('storage/' . $path)]);
        }

        return response()->json(['message' => 'Creado correctamente', 'data' => $animal->load('especie')], 201);
    }

    public function update(Request $request, $id)
    {
        $animal = Animal::findOrFail($id);
        if ($animal->user_id !== Auth::id() && Auth::user()->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($request->hasFile('imagen')) {
            if ($animal->imagen_url) {
                Storage::disk('public')->delete(str_replace(asset('storage/'), '', $animal->imagen_url));
            }
            $path = $request->file('imagen')->store('animales', 'public');
            $animal->imagen_url = asset('storage/' . $path);
        }

        $animal->update($request->except(['imagen', 'imagen_url']));
        return response()->json(['message' => 'Actualizado correctamente', 'data' => $animal->load('especie')]);
    }

    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);
        if ($animal->user_id !== Auth::id() && Auth::user()->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($animal->imagen_url) {
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $animal->imagen_url));
        }

        $animal->delete();
        return response()->json(['message' => 'Eliminado']);
    }

    public function misAnimales(Request $request)
    {
        return response()->json(Animal::where('user_id', $request->user()->id)->with('especie')->get());
    }

    /**
     * 🚀 NUEVO: Revertir estado de un animal
     */
    public function revertirAdopcion(Request $request, $id)
    {
        $animal = Animal::findOrFail($id);

        if ($animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Cambiar estado a Disponible
        $animal->estado = 'Disponible';
        $animal->save();

        // Opcional: Marcar la adopción anterior como 'Devuelta' para mantener historial
        Adopcion::where('animal_id', $animal->id)
                ->where('estado', 'Aprobada')
                ->update(['estado' => 'Devuelta']);

        return response()->json(['message' => 'El animal vuelve a estar disponible.']);
    }
}