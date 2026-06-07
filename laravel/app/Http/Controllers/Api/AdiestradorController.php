<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Controlador para gestionar las operaciones relacionadas con los adiestradores.
 * Proporciona métodos para listar y mostrar detalles de los adiestradores registrados en el sistema.
 */
class AdiestradorController extends Controller
{
    public function index()
    {
        // Filtramos solo los usuarios que son adiestradores
        $adiestradores = User::where('rol', 'adiestrador')->get();
        return response()->json($adiestradores);
    }

    public function show($id)
    {
        $adiestrador = User::where('rol', 'adiestrador')->findOrFail($id);
        return response()->json($adiestrador);
    }
}
