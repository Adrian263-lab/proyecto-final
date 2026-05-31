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

    /**
     * Obtener estadísticas de recaudación mensual para la protectora (GET /api/protectora/recaudacion-mensual)
     */
    public function recaudacionMensual()
    {
        // 1. Inicializamos un array con los 12 meses del año en 0.00
        $mesesValores = array_fill(1, 12, 0);

        // 2. Recuperamos las cuotas de apadrinamientos activos vinculados a los animales de esta protectora
        $apadrinamientosActivos = Apadrinamiento::where('activo', true)
            ->whereHas('animal', function($query) {
                $query->where('user_id', Auth::id()); // Filtra solo animales de la protectora logueada
            })
            ->get();

        // 3. Sumamos las cuotas mensuales en el mes correspondiente basándonos en la fecha de inicio
        foreach ($apadrinamientosActivos as $item) {
            if ($item->fecha_inicio) {
                // Extraemos el número de mes (1 al 12) de la fecha
                $mes = (int) date('n', strtotime($item->fecha_inicio));
                $mesesValores[$mes] += (float) $item->cuota_mensual;
            }
        }

        // 4. Mapeamos a un formato JSON limpio indexado por los nombres de los meses
        $nombresMeses = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril', 
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto', 
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];

        $labels = [];
        $data = [];

        foreach ($nombresMeses as $num => $nombre) {
            $labels[] = $nombre;
            $data[] = round($mesesValores[$num], 2);
        }

        return response()->json([
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Recaudación Mensual (€)',
                    'data' => $data,
                ]
            ]
        ], 200);
    }
}