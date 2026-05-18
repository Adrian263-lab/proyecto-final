<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

// Importación de Controladores
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\AdiestradorController;
use App\Http\Controllers\Api\ApadrinamientoController;
use App\Http\Controllers\Api\EspecieController;
use App\Http\Controllers\Api\ProtectoraController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Accesibles sin estar logueado)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protectoras
Route::get('/protectoras', [ProtectoraController::class, 'index']);
Route::get('/protectoras/{id}', [ProtectoraController::class, 'show']);

// Animales
Route::get('/animales', [AnimalController::class, 'index']);
Route::get('/animales/{id}', [AnimalController::class, 'show']);

// Otros recursos
Route::get('/especies', [EspecieController::class, 'index']);
Route::get('/eventos', [EventoController::class, 'index']);
Route::get('/adiestradores', [AdiestradorController::class, 'index']);
Route::get('/adiestradores/{id}', [AdiestradorController::class, 'show']);


/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Requieren Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- Perfil de Usuario ---
    Route::get('/user', function (Request $request) { 
        return $request->user(); 
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/perfil/update', [UserController::class, 'update']);
    Route::post('/perfil/logo', [UserController::class, 'updateLogo']); // Nueva ruta para el logo

    // --- 1. ZONA ADMINISTRADOR ---
    Route::prefix('admin')->group(function () {
        Route::get('/pendientes', function() {
            return User::where('rol', 'protectora')->where('validado', false)->get();
        });

        Route::put('/validar/{id}', function($id) {
            $user = User::findOrFail($id);
            $user->validado = true;
            $user->save();
            return response()->json(['message' => 'Protectora validada y activada']);
        });

        Route::delete('/rechazar/{id}', function($id) {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Solicitud rechazada y eliminada']);
        });
    });

    // --- 2. ZONA PROTECTORA ---
    // Gestión de animales
    Route::get('/mis-animales', [AnimalController::class, 'misAnimales']);
    Route::post('/animales', [AnimalController::class, 'store']);
    Route::put('/animales/{id}', [AnimalController::class, 'update']);
    Route::delete('/animales/{id}', [AnimalController::class, 'destroy']);

    // Gestión de eventos
    Route::get('/mis-eventos', [EventoController::class, 'misEventos']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::put('/eventos/{id}', [EventoController::class, 'update']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    // --- 3. ZONA PARTICULAR ---
    Route::get('/mis-apadrinamientos', [ApadrinamientoController::class, 'misApadrinamientos']);
    Route::post('/apadrinar', [ApadrinamientoController::class, 'store']);
});
