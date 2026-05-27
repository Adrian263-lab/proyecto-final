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
            ->with('user:id,name') // Solo traemos el nombre del usuario
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

        // Evitar que el usuario se valore a sí mismo o duplique (opcional)
        $valoracion = Valoracion::create([
            'user_id' => $request->user()->id,
            'protectora_id' => $protectoraId,
            'puntuacion' => $request->puntuacion,
            'comentario' => $request->comentario,
        ]);

        return response()->json(['message' => 'Valoración enviada', 'data' => $valoracion], 201);
    }
}