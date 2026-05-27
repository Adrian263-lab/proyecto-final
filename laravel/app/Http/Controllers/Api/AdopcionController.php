<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Notifications\AnimalAdoptado;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use Illuminate\Support\Facades\Notification;

class AdopcionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'tipo_vivienda' => 'required|string',
            'tiene_jardin' => 'required|boolean',
            'otras_mascotas' => 'required|string',
            'horas_solo' => 'required|numeric',
            'motivo' => 'required|string'
        ]);

        if (
            Adopcion::where('user_id', $request->user()->id)
                ->where('animal_id', $request->animal_id)
                ->where('estado', 'Pendiente')
                ->exists()
        ) {
            return response()->json(['message' => 'Ya tienes una solicitud pendiente para este animal.'], 400);
        }

        $adopcion = Adopcion::create([
            'user_id' => $request->user()->id,
            'animal_id' => $request->animal_id,
            'tipo_vivienda' => $request->tipo_vivienda,
            'tiene_jardin' => $request->tiene_jardin,
            'otras_mascotas' => $request->otras_mascotas,
            'horas_solo' => $request->horas_solo,
            'motivo' => $request->motivo,
            'estado' => 'Pendiente'
        ]);

        $animal = Animal::find($request->animal_id);
        if ($animal && $animal->user) {
            $animal->user->notify(new NuevaSolicitudAdopcion($adopcion, $animal, $request->user()));
        }

        return response()->json(['message' => 'Cuestionario enviado con éxito.'], 201);
    }

    // En AdopcionController.php, en el método 'pendientesProtectora'
    public function pendientesProtectora(Request $request)
    {
        return Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', fn($q) => $q->where('user_id', $request->user()->id))
            ->get(); // Esto debería incluir todas las columnas por defecto
    }

    public function aprobar(Request $request, $id)
    {
        $adopcion = Adopcion::with('animal')->findOrFail($id);
        if ($adopcion->animal->user_id !== $request->user()->id)
            return response()->json(['message' => 'No autorizado'], 403);

        $adopcion->update(['estado' => 'Aprobada']);
        $adopcion->user->notify(new AdopcionAprobada($adopcion));
        $adopcion->animal->update(['estado' => 'Adoptado']);

        // Rechazar otras solicitudes para el mismo animal
        Adopcion::where('animal_id', $adopcion->animal_id)
            ->where('id', '!=', $adopcion->id)
            ->update(['estado' => 'Rechazada']);

        return response()->json(['message' => 'Adopción aprobada.']);
    }

    public function rechazar(Request $request, $id)
    {
        $adopcion = Adopcion::with('animal')->findOrFail($id);

        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->update(['estado' => 'Rechazada']);

        // 🚀 Notificar al usuario que su solicitud fue rechazada
        $adopcion->user->notify(new AdopcionRechazada($adopcion));

        return response()->json(['message' => 'Adopción rechazada correctamente.']);
    }
}