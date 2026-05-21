<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Notifications\AnimalAdoptado;
use App\Notifications\AdopcionAprobada;
use Illuminate\Support\Facades\Notification;

class AdopcionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'animal_id'      => 'required|exists:animals,id',
            'tipo_vivienda'  => 'required|string',
            'tiene_jardin'   => 'required|boolean',
            'otras_mascotas' => 'required|string',
            'horas_solo'     => 'required|numeric',
            'motivo'         => 'required|string'
        ]);

        if (Adopcion::where('user_id', $request->user()->id)
                    ->where('animal_id', $request->animal_id)
                    ->where('estado', 'Pendiente')
                    ->exists()) {
            return response()->json(['message' => 'Ya tienes una solicitud pendiente para este animal.'], 400);
        }

        Adopcion::create([
            'user_id'        => $request->user()->id,
            'animal_id'      => $request->animal_id,
            'tipo_vivienda'  => $request->tipo_vivienda,
            'tiene_jardin'   => $request->tiene_jardin,
            'otras_mascotas' => $request->otras_mascotas,
            'horas_solo'     => $request->horas_solo,
            'motivo'         => $request->motivo,
            'estado'         => 'Pendiente'
        ]);

        return response()->json(['message' => 'Cuestionario enviado con éxito.'], 201);
    }

    public function pendientesProtectora(Request $request)
    {
        if ($request->user()->rol !== 'protectora') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', function($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->get();
    }

    public function aprobar(Request $request, $id)
    {
        $adopcion = Adopcion::with('animal')->findOrFail($id);

        if ($request->user()->rol !== 'protectora' || $adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->estado = 'Aprobada';
        $adopcion->save();

        $adopcion->user->notify(new AdopcionAprobada($adopcion));

        $animal = $adopcion->animal;
        $animal->estado = 'Adoptado';
        $animal->save();

        if (method_exists($animal, 'padrinos')) {
            $padrinos = $animal->padrinos;
            if ($padrinos && $padrinos->count() > 0) {
                Notification::send($padrinos, new AnimalAdoptado($animal));
            }
        }

        Adopcion::where('animal_id', $animal->id)
            ->where('id', '!=', $adopcion->id)
            ->update(['estado' => 'Rechazada']);

        return response()->json(['message' => 'Adopción aprobada correctamente.']);
    }

    public function rechazar(Request $request, $id)
    {
        $adopcion = Adopcion::with('animal')->findOrFail($id);

        if ($request->user()->rol !== 'protectora' || $adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->estado = 'Rechazada';
        $adopcion->save();

        return response()->json(['message' => 'Adopción rechazada.']);
    }
}