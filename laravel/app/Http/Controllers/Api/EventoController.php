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
     * Se usa en el calendario de la página de Inicio.
     */
    public function index()
    {
        // Volvemos a 'protectora' que es el nombre real de la relación en tu modelo Evento
        $eventos = Evento::with('protectora')
            ->orderBy('fecha', 'asc')
            ->get();

        return response()->json($eventos);
    }

    /**
     * Listado exclusivo para la protectora logueada (Privado)
     * Se usa en el Panel de Protectora -> Mis Eventos.
     */
    public function misEventos(Request $request)
    {
        $eventos = Evento::where('user_id', $request->user()->id)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($eventos);
    }

    /**
     * Crear un nuevo evento (Solo Protectoras validadas)
     */
    public function store(Request $request)
    {
        // 1. Seguridad: Solo protectoras validadas
        if ($request->user()->rol !== 'protectora' || !$request->user()->validado) {
            return response()->json(['message' => 'No tienes permiso o tu cuenta no ha sido validada.'], 403);
        }

        // 2. Validación
        $validated = $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha'       => 'required|date|after:today', 
            'ubicacion'   => 'required|string|max:255',
            'imagen_url'  => 'nullable|url'
        ]);

        // 3. Creación vinculada al usuario autenticado
        try {
            $evento = $request->user()->eventos()->create($validated);

            return response()->json([
                'message' => '¡Evento publicado con éxito!',
                'data'    => $evento
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al guardar el evento.'], 500);
        }
    }

    /**
     * Ver detalle de un evento específico (Público)
     */
    public function show($id)
    {
        // Cambiado también aquí a 'protectora' para que no falle al pulsar "Ver más"
        $evento = Evento::with('protectora')->findOrFail($id);
        
        return response()->json($evento);
    }

    /**
     * Actualizar evento (Solo el dueño)
     */
    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        // Seguridad: Verificar que el evento pertenece al usuario
        if ($evento->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para editar este evento.'], 403);
        }

        $validated = $request->validate([
            'titulo'      => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'fecha'       => 'sometimes|date|after:today',
            'ubicacion'   => 'sometimes|string|max:255',
            'imagen_url'  => 'nullable|url'
        ]);

        $evento->update($validated);

        return response()->json([
            'message' => 'Evento actualizado correctamente',
            'data'    => $evento
        ]);
    }

    /**
     * Eliminar evento (Solo el dueño)
     */
    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);

        if ($evento->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para borrar este evento.'], 403);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado correctamente']);
    }

    /**
     * Opcional: Subida de imágenes si decides no usar URLs externas
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('eventos', 'public');
            return response()->json(['url' => asset('storage/' . $path)]);
        }

        return response()->json(['message' => 'Error al subir imagen'], 400);
    }
}