<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Models\Usuario;
use App\Models\Apadrinamiento;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use App\Notifications\AnimalAdoptadoPadrino;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
                $padrino = Usuario::find($apadrinamiento->user_id);
                
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
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);
        $adopcion->update(['estado' => 'Rechazada']);

        if ($adopcion->user) {
            $adopcion->user->notify(new AdopcionRechazada($adopcion));
        }

        return response()->json(['message' => 'Adopción rechazada correctamente.']);
    }
}