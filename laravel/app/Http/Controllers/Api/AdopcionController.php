<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use Illuminate\Support\Facades\Log;

class AdopcionController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Payload recibido:', $request->all());

        // 1. Validaciones
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

        // 2. Comprobar duplicados
        $existePendiente = Adopcion::where('user_id', $request->user()->id)
            ->where('animal_id', $request->animal_id)
            ->where('estado', 'Pendiente')
            ->exists();

        if ($existePendiente) {
            return response()->json(['message' => 'Ya tienes una solicitud pendiente para este animal.'], 400);
        }

        // 3. Crear adopción usando los datos ya validados
        $adopcion = Adopcion::create([
            'user_id' => $request->user()->id,
            'animal_id' => $validated['animal_id'],
            'tipo_vivienda' => $validated['tipo_vivienda'],
            'tiene_jardin' => $validated['tiene_jardin'],
            'otras_mascotas' => $validated['otras_mascotas'],
            'horas_solo' => $validated['horas_solo'],
            'motivo' => $validated['motivo'],
            'telefono' => $validated['telefono'],
            'experiencia' => $validated['experiencia'],
            'estado' => 'Pendiente'
        ]);

        // 4. Notificar a la protectora / dueño del animal
        $animal = Animal::find($validated['animal_id']);
        if ($animal && $animal->user) {
            $animal->user->notify(new NuevaSolicitudAdopcion($adopcion, $animal, $request->user()));
        }

        return response()->json(['message' => 'Cuestionario enviado con éxito.'], 201);
    }

    public function pendientesProtectora(Request $request)
    {
        return Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', fn($q) => $q->where('user_id', $request->user()->id))
            ->get();
    }

    public function aprobar(Request $request, $id)
    {
        // 🌟 CORRECCIÓN: Se añade 'user' al eager loading para poder notificarle sin errores
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);
        
        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->update(['estado' => 'Aprobada']);
        
        // Notificar al adoptante
        if ($adopcion->user) {
            $adopcion->user->notify(new AdopcionAprobada($adopcion));
        }
        
        // Cambiar estado del animal
        $adopcion->animal->update(['estado' => 'Adoptado']);

        // Rechazar otras solicitudes para el mismo animal
        Adopcion::where('animal_id', $adopcion->animal_id)
            ->where('id', '!=', $adopcion->id)
            ->update(['estado' => 'Rechazada']);

        return response()->json(['message' => 'Adopción aprobada.']);
    }

    public function rechazar(Request $request, $id)
    {
        // 🌟 CORRECCIÓN: Se añade 'user' al eager loading para evitar fallos en la notificación
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);

        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->update(['estado' => 'Rechazada']);

        // Notificar al usuario que su solicitud fue rechazada
        if ($adopcion->user) {
            $adopcion->user->notify(new AdopcionRechazada($adopcion));
        }

        return response()->json(['message' => 'Adopción rechazada correctamente.']);
    }
}