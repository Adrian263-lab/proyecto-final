<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Models\Apadrinamiento;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use App\Notifications\AnimalAdoptadoPadrino;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Clase controladora para la gestión del ciclo de vida de las solicitudes de adopción.
 * Gobierna el almacenamiento de cuestionarios, consultas analíticas por entidad protectora
 * y los procesos transaccionales de aprobación, rechazo y cancelación colateral de apadrinamientos.
 */
class AdopcionController extends Controller
{
    /**
     * Almacena una nueva solicitud de adopción en el sistema previo proceso de validación.
     * Restringe duplicados en estado pendiente y despacha notificaciones a la entidad protectora.
     * @param Request $request Petición HTTP con los parámetros del cuestionario.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        Log::info('Payload recibido para nueva adopción:', $request->all());

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
            'telefono' => $request->telefono,
            'experiencia' => $request->experiencia,
            'estado' => 'Pendiente'
        ]);

        $animal = Animal::find($request->animal_id);
        if ($animal && $animal->user) {
            $animal->user->notify(new NuevaSolicitudAdopcion($adopcion, $animal, $request->user()));
        }

        return response()->json(['message' => 'Cuestionario enviado con éxito.'], 201);
    }

    /**
     * Recupera las solicitudes de adopción en estado pendiente vinculadas a los animales de la protectora autenticada.
     * @param Request $request Petición HTTP del contexto del usuario.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function pendientesProtectora(Request $request)
    {
        return Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', fn($q) => $q->where('user_id', $request->user()->id))
            ->get();
    }

    /**
     * Aprueba una solicitud de adopción mediante un bloque transaccional seguro.
     * Actualiza la ficha del animal a "Adoptado", rechaza solicitudes concurrentes del mismo espécimen,
     * rescinde de forma masiva los apadrinamientos activos y notifica formalmente a todos los padrinos afectados.
     * @param Request $request Petición HTTP del contexto de la protectora.
     * @param int $id Identificador unívoco de la adopción.
     * @return \Illuminate\Http\JsonResponse
     */
    public function aprobar(Request $request, $id)
    {
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);
        
        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        /**
         * Encapsulamiento del proceso bajo una transacción de base de datos para garantizar
         * la atomicidad y la integridad referencial de los datos.
         */
        DB::transaction(function () use ($adopcion) {
            
            $adopcion->update(['estado' => 'Aprobada']);
            $adopcion->animal->update(['estado' => 'Adoptado']);

            if ($adopcion->user) {
                $adopcion->user->notify(new AdopcionAprobada($adopcion));
            }

            /** Cancelación y exclusión de solicitudes paralelas para el mismo animal */
            Adopcion::where('animal_id', $adopcion->animal_id)
                ->where('id', '!=', $adopcion->id)
                ->update(['estado' => 'Rechazada']);

            /**
             * Flujo Automatizado: Localización e interrupción de apadrinamientos vigentes.
             * Modifica el estado contable y despacha la notificación correspondiente a los padrinos.
             */
            $apadrinamientosActivos = Apadrinamiento::with('user')
                ->where('animal_id', $adopcion->animal_id)
                ->where('estado', 'Activo')
                ->get();

            foreach ($apadrinamientosActivos as $apadrinamiento) {
                $apadrinamiento->update(['estado' => 'Cancelado']);

                if ($apadrinamiento->user) {
                    $apadrinamiento->user->notify(new AnimalAdoptadoPadrino($adopcion->animal));
                }
            }
        });

        return response()->json(['message' => 'Adopción aprobada.']);
    }

    /**
     * Deniega una solicitud de adopción específica y despacha la notificación de resolución al usuario solicitante.
     * @param Request $request Petición HTTP del contexto de la protectora.
     * @param int $id Identificador unívoco de la adopción.
     * @return \Illuminate\Http\JsonResponse
     */
    public function rechazar(Request $request, $id)
    {
        $adopcion = Adopcion::with('animal')->findOrFail($id);

        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $adopcion->update(['estado' => 'Rechazada']);

        if ($adopcion->user) {
            $adopcion->user->notify(new AdopcionRechazada($adopcion));
        }

        return response()->json(['message' => 'Adopción rechazada correctamente.']);
    }
}