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
use App\Http\Controllers\Api\AdopcionController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/protectoras', [ProtectoraController::class, 'index']);
Route::get('/protectoras/{id}', [ProtectoraController::class, 'show']);
Route::get('/animales', [AnimalController::class, 'index']);
Route::get('/animales/{id}', [AnimalController::class, 'show']);
Route::get('/especies', [EspecieController::class, 'index']);
Route::get('/adiestradores', [AdiestradorController::class, 'index']);
Route::get('/adiestradores/{id}', [AdiestradorController::class, 'show']);
Route::get('/eventos', [EventoController::class, 'index']);
Route::get('/eventos/{id}', [EventoController::class, 'show']); 

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Requieren Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user()); 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/perfil/update', [UserController::class, 'update']);
    Route::post('/perfil/logo', [UserController::class, 'updateLogo']); 

    // --- 1. ZONA ADMINISTRADOR ---
    Route::prefix('admin')->group(function () {
        Route::get('/pendientes', fn() => User::where('rol', 'protectora')->where('validado', false)->get());
        Route::put('/validar/{id}', function($id) {
            $user = User::findOrFail($id);
            $user->validado = true;
            $user->save();
            return response()->json(['message' => 'Protectora validada']);
        });
        Route::delete('/rechazar/{id}', function($id) {
            User::findOrFail($id)->delete();
            return response()->json(['message' => 'Solicitud rechazada']);
        });
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
    });

    // --- 2. ZONA PROTECTORA ---
    Route::get('/mis-animales', [AnimalController::class, 'misAnimales']);
    Route::post('/animales', [AnimalController::class, 'store']);
    Route::put('/animales/{id}', [AnimalController::class, 'update']);
    Route::delete('/animales/{id}', [AnimalController::class, 'destroy']);
    
    Route::put('/animales/revertir/{id}', [AnimalController::class, 'revertirAdopcion']);

    Route::get('/mis-eventos', [EventoController::class, 'misEventos']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::put('/eventos/{id}', [EventoController::class, 'update']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    // Gestión de Adopciones
    Route::get('/protectora/solicitudes', [AdopcionController::class, 'pendientesProtectora']);
    Route::put('/protectora/adopciones/aprobar/{id}', [AdopcionController::class, 'aprobar']);
    Route::put('/protectora/adopciones/rechazar/{id}', [AdopcionController::class, 'rechazar']);

    // --- 3. ZONA PARTICULAR ---
    Route::get('/mis-apadrinamientos', [ApadrinamientoController::class, 'misApadrinamientos']);
    Route::post('/apadrinar', [ApadrinamientoController::class, 'store']);
    Route::post('/adoptar', [AdopcionController::class, 'store']);
    
    // --- 4. NUEVAS RUTAS DE INSCRIPCIÓN A EVENTOS ---
    Route::post('/eventos/{id}/inscribirse', [EventoController::class, 'inscribirse']);
    Route::delete('/eventos/{id}/desinscribirse', [EventoController::class, 'desinscribirse']);
    Route::get('/eventos/{id}/check-inscripcion', [EventoController::class, 'checkInscripcion']);
    
    // Notificaciones
    Route::get('/notificaciones', fn(Request $request) => response()->json($request->user()->unreadNotifications));
    Route::post('/notificaciones/marcar-leidas', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Leídas']);
    });
});