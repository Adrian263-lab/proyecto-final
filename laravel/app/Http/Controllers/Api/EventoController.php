<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EventoController extends Controller
{
    /**
     * Listado global de eventos (Público)
     */
    public function index()
    {
        $eventos = Evento::with('protectora')
            ->orderBy('fecha', 'asc')
            ->get();

        return response()->json($eventos);
    }

    /**
     * Listado exclusivo para la protectora logueada
     */
    public function misEventos(Request $request)
    {
        $eventos = Evento::where('user_id', $request->user()->id)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($eventos);
    }

    /**
     * Crear un nuevo evento
     */
    public function store(Request $request)
    {
        if ($request->user()->rol !== 'protectora' || !$request->user()->validado) {
            return response()->json(['message' => 'No tienes permiso o tu cuenta no ha sido validada.'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date|after:today',
            'ubicacion' => 'required|string|max:255',
            'imagen_url' => 'nullable|url'
        ]);

        try {
            $evento = $request->user()->eventos()->create($validated);
            return response()->json([
                'message' => '¡Evento publicado con éxito!',
                'data' => $evento
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al guardar el evento.'], 500);
        }
    }

    /**
     * Ver detalle de un evento (Incluye conteo de inscritos)
     */
    public function show($id)
    {
        $evento = Evento::with('protectora')
                        ->withCount('inscritos')
                        ->findOrFail($id);

        return response()->json($evento);
    }

    /**
     * Actualizar evento
     */
    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);
        $usuarioLogueado = Auth::user();

        if ($evento->user_id !== $usuarioLogueado->id && $usuarioLogueado->rol !== 'admin') {
            return response()->json(['message' => 'No tienes permiso.'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'fecha' => 'sometimes|date|after:today',
            'ubicacion' => 'sometimes|string|max:255',
            'imagen_url' => 'nullable|url'
        ]);

        $evento->update($validated);

        return response()->json(['message' => 'Evento actualizado', 'data' => $evento]);
    }

    /**
     * Eliminar evento
     */
    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);
        $usuarioLogueado = Auth::user();

        if ($evento->user_id !== $usuarioLogueado->id && $usuarioLogueado->rol !== 'admin') {
            return response()->json(['message' => 'No tienes permiso.'], 403);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado correctamente']);
    }

    /**
     * Gestión de Inscripciones (Muchos a muchos)
     */
    public function inscribirse(Request $request, $eventoId)
    {
        if ($request->user()->rol !== 'particular') {
            return response()->json(['message' => 'Solo usuarios particulares pueden inscribirse'], 403);
        }

        $request->user()->eventosInscritos()->syncWithoutDetaching([$eventoId]);
        
        return response()->json(['message' => 'Inscripción exitosa']);
    }

    public function desinscribirse(Request $request, $eventoId)
    {
        $request->user()->eventosInscritos()->detach($eventoId);
        return response()->json(['message' => 'Te has desinscrito correctamente']);
    }

    public function checkInscripcion(Request $request, $eventoId)
    {
        $inscrito = $request->user()->eventosInscritos()
            ->where('evento_id', $eventoId)
            ->exists();

        return response()->json(['inscrito' => $inscrito]);
    }

    /**
     * Devuelve los eventos a los que el usuario logueado está inscrito
     */
    public function misEventosInscritos(Request $request)
    {
        // Esto accede a la relación que definimos en el Modelo User
        // y devuelve la lista de eventos asociados a ese usuario
        return response()->json($request->user()->eventosInscritos);
    }
}