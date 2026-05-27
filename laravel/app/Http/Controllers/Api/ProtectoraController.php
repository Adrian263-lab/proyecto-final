<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Valoracion;
use Illuminate\Http\Request;

class ProtectoraController extends Controller
{
    // Listar solo las protectoras VALIDADAS para el público
    public function index()
    {
        $protectoras = User::where('rol', 'protectora')
            ->where('validado', true)
            ->get();
            
        return response()->json($protectoras);
    }

    // Ver una protectora específica (solo si está validada)
    public function show($id)
    {
        $protectora = User::where('rol', 'protectora')
            ->where('validado', true)
            ->with(['animales', 'valoraciones.user']) // Incluimos valoraciones y quién las hizo
            ->findOrFail($id);

        return response()->json($protectora);
    }

    /**
     * Obtener el ranking de las 5 mejores protectoras
     */
    public function ranking()
    {
        $ranking = User::where('rol', 'protectora')
            ->where('validado', true)
            ->withAvg('valoraciones as media_puntuacion', 'puntuacion')
            ->orderByDesc('media_puntuacion')
            ->limit(5)
            ->get();

        return response()->json($ranking);
    }

    /**
     * Registrar una valoración para una protectora
     */
    public function valorar(Request $request, $id)
    {
        $request->validate([
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        $valoracion = Valoracion::create([
            'user_id' => $request->user()->id,
            'protectora_id' => $id,
            'puntuacion' => $request->puntuacion,
            'comentario' => $request->comentario,
        ]);

        return response()->json(['message' => 'Valoración enviada con éxito', 'data' => $valoracion], 201);
    }
}