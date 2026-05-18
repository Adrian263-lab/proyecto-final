<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProtectoraController extends Controller
{
    // Listar solo las protectoras VALIDADAS para el público
    public function index()
    {
        $protectoras = User::where('rol', 'protectora')
            ->where('validado', true)
            ->get();
            
        return response()->json($protectoras);
    }

    // Ver una protectora específica (solo si está validada)
    public function show($id)
    {
        $protectora = User::where('rol', 'protectora')
            ->where('validado', true)
            ->with('animales') 
            ->findOrFail($id);

        return response()->json($protectora);
    }
}