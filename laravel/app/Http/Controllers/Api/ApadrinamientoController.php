<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apadrinamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApadrinamientoController extends Controller
{
    /**
     * Muestra los apadrinamientos del usuario autenticado (React pedirá esto para el perfil)
     */
    public function misApadrinamientos(Request $request)
    {
        // Traemos los apadrinamientos con los datos del animal para mostrarlos en React
        $apadrinamientos = $request->user()
            ->apadrinamientos()
            ->with('animal')
            ->get();

        return response()->json($apadrinamientos);
    }

    /**
     * Crea un nuevo apadrinamiento (Cuando un usuario pulsa "Apadrinar" en React)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'cuota_mensual' => 'required|numeric|min:1',
        ]);

        // Comprobamos si ya lo apadrina para no duplicar
        $existe = Apadrinamiento::where('user_id', $request->user()->id)
            ->where('animal_id', $request->animal_id)
            ->where('activo', true)
            ->first();

        if ($existe) {
            return response()->json(['message' => 'Ya apadrinas a este animal'], 400);
        }

        $apadrinamiento = $request->user()->apadrinamientos()->create([
            'animal_id' => $request->animal_id,
            'cuota_mensual' => $request->cuota_mensual,
            'fecha_inicio' => now(),
            'activo' => true
        ]);

        return response()->json([
            'message' => '¡Gracias! Ahora eres padrino/madrina.',
            'data' => $apadrinamiento->load('animal')
        ], 201);
    }

    /**
     * Cancelar un apadrinamiento
     */
    public function destroy($id)
    {
        $apadrinamiento = Auth::user()->apadrinamientos()->findOrFail($id);
        $apadrinamiento->delete();

        return response()->json(['message' => 'Apadrinamiento cancelado correctamente']);
    }
}
