<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apadrinamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Controlador para gestionar las operaciones relacionadas con los apadrinamientos.
 * Proporciona métodos para registrar un nuevo apadrinamiento, obtener los apadrinados del usuario en sesión,
 * cancelar un apadrinamiento activo y obtener estadísticas de recaudación mensual para la protectora.
 */
class ApadrinamientoController extends Controller
{
    
    public function store(Request $request)
    {
        // Validamos el contrato de datos que viene de tu pasarela de React
        $request->validate([
            'animal_id' => 'required|exists:animals,id',
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
            'cuota_mensual' => $request->cantidad,     
            'fecha_inicio'  => now()->toDateString(), 
            'activo'        => true,
        ]);

        return response()->json([
          'message' => '¡Apadrinamiento registrado con éxito!',
          'data' => $apadrinamiento
        ], 201);
    }

    
    public function misApadrinamientos()
    {
        $apadrinados = Apadrinamiento::where('user_id', Auth::id())
            ->where('activo', true)
            ->with('animal.user') // Eloquent resuelve la relación recursiva automáticamente
            ->get();

        return response()->json($apadrinados, 200);
    }

    
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

    
    public function recaudacionMensual()
    {
        //Inicializamos el array con los 12 meses del año actual en 0
        $mesesValores = array_fill(1, 12, 0);
        $añoActual = (int) date('Y');
        $mesActual = (int) date('n');

        
        $todosLosApadrinamientos = Apadrinamiento::whereHas('animal', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();

        
        foreach ($todosLosApadrinamientos as $item) {
            if ($item->fecha_inicio) {
                $añoInicio = (int) date('Y', strtotime($item->fecha_inicio));
                $mesInicio = (int) date('n', strtotime($item->fecha_inicio));

                // Solo contamos si el apadrinamiento empezó en este año o antes
                if ($añoInicio <= $añoActual) {
                    
                    // Recorremos los 12 meses del año para ver en cuáles aplica
                    for ($m = 1; $m <= 12; $m++) {
                        
                        // El mes evaluado debe ser igual o posterior al mes en el que se inició el apadrinamiento
                        if ($añoInicio < $añoActual || $m >= $mesInicio) {
                            
                            if ($item->activo) {
                                // Si está activo, suma en todos los meses desde que empezó hasta el mes actual de la simulación
                                if ($m <= $mesActual) {
                                    $mesesValores[$m] += (float) $item->cuota_mensual;
                                }
                            } else {
                                // Si está INACTIVO (fue cancelado), significa que el usuario canceló este mes.
                                // Por tanto, el dinero sigue contando para los meses anteriores y para el mes actual,
                                // pero NO sumará para el mes siguiente ($m > $mesActual).
                                if ($m <= $mesActual) {
                                    $mesesValores[$m] += (float) $item->cuota_mensual;
                                }
                            }

                        }
                    }

                }
            }
        }

        //Mapeamos al formato JSON que espera a Chart.js en React
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