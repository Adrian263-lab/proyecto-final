<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Valoracion;
use Illuminate\Http\Request;

class ValoracionController extends Controller
{
    // Obtener valoraciones de una protectora específica
    public function index($protectoraId)
    {
        return Valoracion::where('protectora_id', $protectoraId)
            ->with('user:id,name')
            ->latest()
            ->get();
    }

    // Guardar nueva valoración
    public function store(Request $request, $protectoraId)
    {
        $request->validate([
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        $valoracion = Valoracion::create([
            'user_id' => $request->user()->id,
            'protectora_id' => $protectoraId,
            'puntuacion' => $request->puntuacion,
            'comentario' => $request->comentario,
        ]);

        return response()->json(['message' => 'Valoración enviada', 'data' => $valoracion], 201);
    }

    // Editar valoración
    public function update(Request $request, $id)
    {
        $valoracion = Valoracion::findOrFail($id);

        if ($valoracion->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        $valoracion->update($request->only(['puntuacion', 'comentario']));
        return response()->json(['message' => 'Valoración actualizada']);
    }

    // Eliminar valoración
    public function destroy(Request $request, $id)
    {
        $valoracion = Valoracion::findOrFail($id);

        if ($valoracion->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $valoracion->delete();
        return response()->json(['message' => 'Valoración eliminada']);
    }
}