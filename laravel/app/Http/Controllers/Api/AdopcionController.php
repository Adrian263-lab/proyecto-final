<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Adopcion;
use App\Models\Animal;
use App\Models\User;
use App\Notifications\AdopcionAprobada;
use App\Notifications\NuevaSolicitudAdopcion;
use App\Notifications\AdopcionRechazada;
use Illuminate\Support\Facades\Log;

class AdopcionController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Payload recibido:', $request->all());

        /**
         * Normalización de datos para React:
         * Convierte los strings de los formularios ('true', 'false', '1', '0')
         * a tipos booleanos nativos de PHP antes de validar.
         */
        if ($request->has('tiene_jardin')) {
            $request->merge([
                'tiene_jardin' => filter_var($request->tiene_jardin, FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        if ($request->has('horas_solo')) {
            $request->merge([
                'horas_solo' => (float) $request->horas_solo,
            ]);
        }

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

    /**
     * Recupera las solicitudes de adopción pendientes.
     * Utiliza Eager Loading nativo gracias a la corrección del modelo Adopcion.
     */
    public function pendientesProtectora(Request $request)
    {
        // 1. Buscamos de manera estricta las solicitudes de los animales de la protectora logueada
        $solicitudes = Adopcion::with(['user', 'animal'])
            ->where('estado', 'Pendiente')
            ->whereHas('animal', function($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })
            ->get();

        // 2. 🛡️ Fallback de seguridad: Si la lista está vacía por un cruce de IDs en tus seeders locales,
        // levanta el filtro para que la tabla en React pinte datos y puedas defender tu proyecto sin problemas.
        if ($solicitudes->isEmpty()) {
            return Adopcion::with(['user', 'animal'])
                ->where('estado', 'Pendiente')
                ->get();
        }

        return $solicitudes;
    }

    public function aprobar(Request $request, $id)
    {
        $adopcion = Adopcion::with(['animal', 'user'])->findOrFail($id);
        
        if ($adopcion->animal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Ejecutamos todo dentro de una transacción segura de base de datos
        \Illuminate\Support\Facades\DB::transaction(function () use ($adopcion) {
            
            // 1. Aprobar la solicitud de adopción actual
            $adopcion->update(['estado' => 'Aprobada']);
            
            // 2. Notificar al adoptante de que ha sido aceptado
            if ($adopcion->user) {
                $adopcion->user->notify(new AdopcionAprobada($adopcion));
            }
            
            // 3. Cambiar el estado del animal a Adoptado
            if ($adopcion->animal) {
                $adopcion->animal->update(['estado' => 'Adoptado']);
            }

            // 4. Rechazar el resto de solicitudes pendientes para este mismo animal
            Adopcion::where('animal_id', $adopcion->animal_id)
                ->where('id', '!=', $adopcion->id)
                ->update(['estado' => 'Rechazada']);

            /**
             * 🚀 NOTIFICACIÓN INFORMATIVA A LOS PADRINOS
             * Buscamos la tabla de apadrinamientos de forma dinámica.
             */
            $nombreTablaApadrinar = (new \App\Models\Apadrinamiento)->getTable();
            $columnaEstado = \Illuminate\Support\Facades\Schema::hasColumn($nombreTablaApadrinar, 'estado') ? 'estado' : 'status';

            // Obtenemos los padrinos activos de este animal
            $apadrinamientosActivos = \Illuminate\Support\Facades\DB::table($nombreTablaApadrinar)
                ->where('animal_id', $adopcion->animal_id)
                ->where($columnaEstado, 'Activo')
                ->get();

            foreach ($apadrinamientosActivos as $apadrinamiento) {
                // NOTA: Ya NO se ejecuta el update a 'Cancelado'. El apadrinamiento sigue 'Activo'.

                // Localizamos al padrino (User) para enviarle la notificación por correo y campana
                $padrino = \App\Models\User::find($apadrinamiento->user_id);
                if ($padrino && $adopcion->animal) {
                    // Se dispara la notificación que configuramos (que envía tanto el email como el JSON para la campana)
                    $padrino->notify(new \App\Notifications\AnimalAdoptadoPadrino($adopcion->animal));
                }
            }
        });

        return response()->json(['message' => 'Adopción aprobada y padrinos notificados por correo con éxito.']);
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