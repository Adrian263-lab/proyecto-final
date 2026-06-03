<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FavoritoController extends Controller
{
    /**
     * Obtener la lista de protectoras favoritas del usuario autenticado.
     */
    public function index()
    {
        // Trae las protectoras guardadas por este usuario
        $favoritos = Auth::user()->protectorasFavoritas;
        return response()->json($favoritos);
    }

    /**
     * Alternar favorito (Si ya existe lo quita, si no, lo añade).
     */
    public function toggleFavorito(Request $request)
    {
        $request->validate([
            'protectora_id' => 'required|exists:users,id'
        ]);

        $user = Auth::user();
        $protectoraId = $request->protectora_id;

        // 🛡️ Seguridad: Comprobamos que el ID corresponda a un usuario con rol protectora
        $protectora = User::where('id', $protectoraId)->where('rol', 'protectora')->first();
        
        if (!$protectora) {
            return response()->json(['message' => 'El usuario seleccionado no es una protectora.'], 422);
        }

        // El método toggle() añade o quita de la tabla intermedia automáticamente
        $resultado = $user->protectorasFavoritas()->toggle($protectoraId);
        
        // Si se encuentra en el array 'attached', es que se acaba de añadir
        $esFavorito = count($resultado['attached']) > 0;

        return response()->json([
            'is_favorito' => $esFavorito,
            'message' => $esFavorito ? 'Añadida a tus protectoras favoritas ❤️' : 'Eliminada de tus favoritos 💔'
        ]);
    }
}