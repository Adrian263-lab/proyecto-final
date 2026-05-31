<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apadrinamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApadrinamientoController extends Controller
{
    /**
     * Registrar un nuevo apadrinamiento (POST /api/apadrinar)
     */
    public function store(Request $request)
    {
        // Validamos el contrato de datos que viene de tu pasarela de React
        $request->validate([
            'animal_id' => 'required|exists:animals,id', // 'animals' según tu tabla física
            'cantidad'  => 'required|numeric|min:1',
            'titular'   => 'required|string|max:255',
            'iban'      => 'required|string|max:34',
        ]);

        // Verificamos si el usuario autenticado ya está ayudando a este animal específico
        $existe = Apadrinamiento::where('user_id', Auth::id())
                                ->where('animal_id', $request->animal_id)
                                ->where('activo', true)
                                ->first();

        if ($existe) {
            return response()->json([
                'message' => 'Ya estás apadrinando a este peludito actualmente. ¡Muchas gracias por tu implicación! ❤️'
            ], 400);
        }

        // Creamos el registro adaptando el JSON a tu estructura física de base de datos
        $apadrinamiento = Apadrinamiento::create([
            'user_id'       => Auth::id(),
            'animal_id'     => $request->animal_id,
            'cuota_mensual' => $request->cantidad,     // Acoplamos 'cantidad' de React a tu columna 'cuota_mensual'
            'fecha_inicio'  => now()->toDateString(),  // Seteamos la fecha actual automáticamente
            'activo'        => true,
        ]);

        return response()->json([
          'message' => '¡Apadrinamiento registrado con éxito!',
          'data' => $apadrinamiento
        ], 201);
    }

    /**
     * Obtener los apadrinados del usuario en sesión (GET /api/mis-apadrinamientos)
     */
    public function misApadrinamientos()
    {
        // SOLUCIONADO: Cargamos de manera anidada el animal Y el usuario (protectora) dueño de ese animal
        $apadrinados = Apadrinamiento::where('user_id', Auth::id())
            ->where('activo', true)
            ->with('animal.user') // Eloquent resuelve la relación recursiva automáticamente
            ->get();

        return response()->json($apadrinados, 200);
    }

    /**
     * Cancelar un apadrinamiento activo (DELETE o POST /api/apadrinar/{id}/cancelar)
     */
    public function cancelar($id)
    {
        // Buscamos el apadrinamiento asegurándonos de que pertenece al usuario autenticado
        $apadrinamiento = Apadrinamiento::where('id', $id)
                                        ->where('user_id', Auth::id())
                                        ->firstOrFail();

        // Cambiamos el estado a inactivo
        $apadrinamiento->update([
            'activo' => false
        ]);

        return response()->json([
            'message' => 'Apadrinamiento cancelado con éxito. El próximo mes ya no se emitirá ningún cargo.'
        ], 200);
    }
}