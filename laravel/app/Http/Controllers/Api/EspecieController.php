<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Especie;

/**
 * Controlador para gestionar las operaciones relacionadas con las especies de animales.
 * Proporciona un método para listar todas las especies disponibles en el sistema.
 */
class EspecieController extends Controller
{
    public function index() {
        return response()->json(Especie::all());
    }
}
