<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Models\User;
use App\Models\Apadrinamiento;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use App\Notifications\AnimalAdoptadoPadrino;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Controlador para gestionar las operaciones relacionadas con las adopciones.
 * Proporciona métodos para crear solicitudes de adopción, listar solicitudes pendientes,
 * aprobar o rechazar solicitudes, y notificar a los usuarios involucrados.
 */
class AdopcionController extends Controller
{
    public function store(Request $request)
    {
        // Normalización de tipos para el payload de React
        if ($request->has('tiene_jardin')) {
            $request->merge(['tiene_jardin' => filter_var($request->tiene_jardin, FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'tipo_vivienda' => 'required|string',
            'tiene_jardin' => 'required|boolean',
            'otras_mascotas' => 'required|string',
            'horas_solo' => 'required|numeric',
            'motivo' => 'required|string',
            'telefono' => 'nullable|string',
            'experiencia' => 'nullable|string'
        ]);

        $existePendiente = Adopcion::where('user_id', $request->user()->id)
            ->where('animal_id', $request->animal_id)
            ->where('estado', 'Pendiente')
            ->exists();

        if ($existePendiente) {
            return response()->json(['message' => 'Ya tienes una solicitud pendiente para este animal.'], 400);
        }

        $adopcion = Adopcion::create(array_merge($validated, [
            'user_id' => $request->user()->id,
            'estado' => 'Pendiente'
        ]));

        $animal = Animal::find($validated['animal_id']);
        if ($animal && $animal->user) {
            $animal->user->notify(new NuevaSolicitudAdopcion($adopcion, $animal, $request->user()));
        }

        return response()->json(['message' => 'Cuestionario enviado con éxito.'], 201);
    }

    public function pendientesProtectora(Request $request)
    {
        $solicitudes = Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', function($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })->get();

        return $solicitudes->isEmpty() ? Adopcion::with(['user', 'animal'])->where('estado', 'Pendiente')->get() : $solicitudes;
    }

    public function aprobar(Request $request, $id)
    {
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);
        
        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        DB::transaction(function () use ($adopcion) {
            $adopcion->update(['estado' => 'Aprobada']);
            
            if ($adopcion->user) {
                $adopcion->user->notify(new AdopcionAprobada($adopcion));
            }
            
            if ($adopcion->animal) {
                $adopcion->animal->update(['estado' => 'Adoptado']);
            }

            Adopcion::where('animal_id', $adopcion->animal_id)
                ->where('id', '!=', $adopcion->id)
                ->update(['estado' => 'Rechazada']);

            $apadrinamientos = Apadrinamiento::where('animal_id', $adopcion->animal_id)->get();

            foreach ($apadrinamientos as $apadrinamiento) {
                $padrino = User::find($apadrinamiento->user_id);
                
                if ($padrino && $adopcion->animal) {
                    try {
                        // Notificación encolada (gracias al trait ShouldQueue en la clase de notificación)
                        $padrino->notify(new AnimalAdoptadoPadrino($adopcion->animal));
                    } catch (\Exception $e) {
                        Log::error("Fallo al notificar al padrino ID {$padrino->id}: " . $e->getMessage());
                    }
                }
            }
        });

        return response()->json(['message' => 'Adopción aprobada y padrinos informados correctamente.']);
    }

    public function rechazar(Request $request, $id)
    {
        // 1. Buscamos la adopción con sus relaciones necesarias
        $adopcion = Adopcion::with(['animal', 'user'])->find($id);

        if (!$adopcion) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        // 2. Validación de seguridad (solo la protectora dueña del animal puede rechazar)
        if (!$adopcion->animal || $adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        try {
            // 3. Ejecutamos la lógica de forma segura
            $adopcion->update(['estado' => 'Rechazada']);

            // 4. Notificamos al usuario solo si tiene un email válido
            if ($adopcion->user && !empty($adopcion->user->email)) {
                $adopcion->user->notify(new AdopcionRechazada($adopcion));
            }

            return response()->json(['message' => 'Adopción rechazada correctamente.']);

        } catch (\Exception $e) {
            // Registro de error para mantenimiento profesional
            Log::error("Error crítico al rechazar adopción ID {$id}: " . $e->getMessage());
            return response()->json(['message' => 'Error al procesar el rechazo.'], 500);
        }
    }
}