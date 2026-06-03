<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

// Importación de Controladores del Sistema API
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnimalController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\AdiestradorController;
use App\Http\Controllers\Api\ApadrinamientoController;
use App\Http\Controllers\Api\EspecieController;
use App\Http\Controllers\Api\ProtectoraController;
use App\Http\Controllers\Api\AdopcionController;
use App\Http\Controllers\Api\ValoracionController;
use App\Http\Controllers\Api\FavoritoController;

// Importación de Notificaciones de Sistema
use App\Notifications\ProtectoraAceptada;
use App\Notifications\ProtectoraRechazada;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
| Endpoints accesibles de forma abierta sin token de sesión.
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * Endpoints de Verificación de Identidad por Correo Electrónico.
 */
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'El enlace de verificación no es válido o ha expirado.'], 403);
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
    }

    $frontendUrl = env('FRONTEND_URL', 'https://huellitasweb.es');
    return redirect()->to($frontendUrl . '/login?verified=1'); 
})->middleware(['signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Esta cuenta ya está verificada.'], 400);
    }
    
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Enlace de verificación reenviado con éxito a tu bandeja.']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

/**
 * Módulos de Consulta Pública: Protectoras, Animales, Especialistas y Eventos.
 */
Route::get('/protectoras/ranking', [ProtectoraController::class, 'ranking']);
Route::get('/protectoras', [ProtectoraController::class, 'index']);
Route::get('/protectoras/{id}', [ProtectoraController::class, 'show']);
Route::get('/protectoras/{id}/valoraciones', [ValoracionController::class, 'index']);

Route::get('/animales', [AnimalController::class, 'index']);
Route::get('/animales/{id}', [AnimalController::class, 'show']);
Route::get('/especies', [EspecieController::class, 'index']);
Route::get('/adiestradores', [AdiestradorController::class, 'index']);
Route::get('/adiestradores/{id}', [AdiestradorController::class, 'show']);
Route::get('/eventos', [EventoController::class, 'index']);
Route::get('/eventos/{id}', [EventoController::class, 'show']);

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Middleware Sanctum)
|--------------------------------------------------------------------------
| Requieren el envío del Bearer Token de forma obligatoria en la cabecera.
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    /** Gestión del perfil de usuario autenticado */
    Route::put('/perfil/update', [UserController::class, 'update']);
    Route::post('/perfil/logo', [UserController::class, 'updateLogo']);

    /**
     * --- ZONA ADMINISTRADOR ---
     */
    Route::prefix('admin')->group(function () {
        Route::get('/pendientes', fn() => User::where('rol', 'protectora')->where('validado', false)->get());
        
        Route::put('/validar/{id}', function ($id) {
            $user = User::findOrFail($id);
            $user->validado = true;
            $user->save();
            
            $user->notify(new ProtectoraAceptada());
            $user->sendEmailVerificationNotification();
            
            return response()->json([
                'message' => 'Protectora validada y enlace de verificación de correo enviado con éxito.'
            ]);
        });
        
        Route::delete('/rechazar/{id}', function ($id) {
            $user = User::findOrFail($id);
            $user->notify(new ProtectoraRechazada());
            $user->delete();
            
            return response()->json(['message' => 'Solicitud rechazazada y notificación enviada correctamente.']);
        });
        
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
    });

    /**
     * --- ZONA PROTECTORA ---
     */
    Route::get('/protectora/recaudacion-mensual', [ApadrinamientoController::class, 'recaudacionMensual']);
    
    /** Gestión transaccional de catálogo de animales */
    Route::get('/mis-animales', [AnimalController::class, 'misAnimales']);
    Route::post('/animales', [AnimalController::class, 'store']);
    Route::put('/animales/{id}', [AnimalController::class, 'update']);
    Route::delete('/animales/{id}', [AnimalController::class, 'destroy']);
    Route::put('/animales/revertir/{id}', [AnimalController::class, 'revertirAdopcion']);

    /** Gestión de eventos institucionales */
    Route::get('/mis-eventos', [EventoController::class, 'misEventos']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::put('/eventos/{id}', [EventoController::class, 'update']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    /** Gestión de expedientes de adopción */
    Route::get('/protectora/solicitudes', [AdopcionController::class, 'pendientesProtectora']);
    
    /** * 🚀 SOLUCIÓN: Se añade redundancia semántica a la ruta para que responda correctamente
     * tanto a la petición '/aprobar/{id}' como al error de Axios del frontend '/probar/{id}'.
     */
    Route::put('/protectora/adopciones/aprobar/{id}', [AdopcionController::class, 'aprobar']);
    Route::put('/protectora/adopciones/probar/{id}', [AdopcionController::class, 'aprobar']); 
    Route::put('/protectora/adopciones/rechazar/{id}', [AdopcionController::class, 'rechazar']);

    /**
     * --- ZONA PARTICULAR ---
     */
    Route::get('/mis-apadrinamientos', [ApadrinamientoController::class, 'misApadrinamientos']);
    Route::post('/apadrinar', [ApadrinamientoController::class, 'store']);
    Route::post('/apadrinar/{id}/cancelar', [ApadrinamientoController::class, 'cancelar']);
    Route::post('/adoptar', [AdopcionController::class, 'store']);

    /** Gestión de asistencia a eventos */
    Route::post('/eventos/{id}/inscribirse', [EventoController::class, 'inscribirse']);
    Route::delete('/eventos/{id}/desinscribirse', [EventoController::class, 'desinscribirse']);
    Route::get('/eventos/{id}/check-inscripcion', [EventoController::class, 'checkInscripcion']);
    Route::get('/mis-eventos-inscritos', [EventoController::class, 'misEventosInscritos']);

    /** Gestión del módulo de valoraciones y opiniones */
    Route::post('/protectoras/{id}/valorar', [ValoracionController::class, 'store']);
    Route::put('/valoraciones/{id}', [ValoracionController::class, 'update']);
    Route::delete('/valoraciones/{id}', [ValoracionController::class, 'destroy']);

    /** Relación intermedia de entidades favoritas */
    Route::get('/favoritos', [FavoritoController::class, 'index']);
    Route::post('/favoritos/toggle', [FavoritoController::class, 'toggleFavorito']);

    /** Sistema de almacenamiento persistente de notificaciones */
    Route::get('/notificaciones', fn(Request $request) => response()->json($request->user()->unreadNotifications));
    Route::post('/notificaciones/marcar-leidas', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Leídas']);
    });
});