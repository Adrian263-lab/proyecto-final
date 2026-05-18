<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Especie;

class EspecieController extends Controller
{
    public function index() {
        return response()->json(Especie::all());
    }
}
