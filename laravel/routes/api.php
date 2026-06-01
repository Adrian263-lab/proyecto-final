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
use App\Http\Controllers\Api\ValoracionController;

// Importación de Notificaciones para el Admin
use App\Notifications\ProtectoraAceptada;
use App\Notifications\ProtectoraRechazada;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 📬 ENDPOINTS DE VERIFICACIÓN POR CORREO (Corregido para API Desacoplada sin login previo)
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    // 1. Buscamos al usuario por el ID que viaja en la URL firmada
    $user = User::findOrFail($id);

    // 2. Comprobamos de manera segura que el hash del email coincida matemáticamente
    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'El enlace de verificación no es válido o ha expirado.'], 403);
    }

    // 3. Si no estaba verificado, lo marcamos en la base de datos
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
    }

    // 4. Redirigimos dinámicamente al Login de React usando el dominio de producción
    $frontendUrl = env('FRONTEND_URL', 'https://huellitasweb.es');
    return redirect()->to($frontendUrl . '/login?verified=1'); 
})->middleware(['signed'])->name('verification.verify');

// Reenvío de token usando el método seguro personalizado de tu modelo Usuario
Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Esta cuenta ya está verificada.'], 400);
    }
    
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Enlace de verificación reenviado con éxito a tu bandeja.']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');


// Rutas de Protectoras: Fijas primero, luego dinámicas
Route::get('/protectoras/ranking', [ProtectoraController::class, 'ranking']);
Route::get('/protectoras', [ProtectoraController::class, 'index']);
Route::get('/protectoras/{id}', [ProtectoraController::class, 'show']);
Route::get('/protectoras/{id}/valoraciones', [ValoracionController::class, 'index']);

// Otras rutas públicas
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

    // Perfil de usuario
    Route::put('/perfil/update', [UserController::class, 'update']);
    Route::post('/perfil/logo', [UserController::class, 'updateLogo']);

    // --- 1. ZONA ADMINISTRADOR ---
    Route::prefix('admin')->group(function () {
        Route::get('/pendientes', fn() => User::where('rol', 'protectora')->where('validado', false)->get());
        
        // 🚀 CORREGIDO: Añadido sendEmailVerificationNotification() para activar el flujo completo
        Route::put('/validar/{id}', function ($id) {
            $user = User::findOrFail($id);
            $user->validado = true;
            $user->save();
            
            // Dispara la notificación de aceptación (pasa a la cola)
            $user->notify(new ProtectoraAceptada());
            
            // 📬 LE MANDA EL ENLACE REAL DE VERIFICACIÓN DE EMAIL DE FORMA ASÍNCRONA
            $user->sendEmailVerificationNotification();
            
            return response()->json([
                'message' => 'Protectora validada y enlace de verificación de correo enviado con éxito.'
            ]);
        });
        
        Route::delete('/rechazar/{id}', function ($id) {
            $user = User::findOrFail($id);
            
            // Enviamos el correo de rechazo antes de desvincular el objeto de la BD
            $user->notify(new ProtectoraRechazada());
            $user->delete();
            
            return response()->json(['message' => 'Solicitud rechazada y notificación enviada correctamente.']);
        });
        
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
    });

    // --- 2. ZONA PROTECTORA ---
    Route::get('/protectora/recaudacion-mensual', [ApadrinamientoController::class, 'recaudacionMensual']);
    
    // Gestión de Animales
    Route::get('/mis-animales', [AnimalController::class, 'misAnimales']);
    Route::post('/animales', [AnimalController::class, 'store']);
    Route::put('/animales/{id}', [AnimalController::class, 'update']);
    Route::delete('/animales/{id}', [AnimalController::class, 'destroy']);
    Route::put('/animales/revertir/{id}', [AnimalController::class, 'revertirAdopcion']);

    // Gestión de Eventos
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
    Route::post('/apadrinar/{id}/cancelar', [ApadrinamientoController::class, 'cancelar']);
    Route::post('/adoptar', [AdopcionController::class, 'store']);

    // Inscripción a Eventos
    Route::post('/eventos/{id}/inscribirse', [EventoController::class, 'inscribirse']);
    Route::delete('/eventos/{id}/desinscribirse', [EventoController::class, 'desinscribirse']);
    Route::get('/eventos/{id}/check-inscripcion', [EventoController::class, 'checkInscripcion']);
    Route::get('/mis-eventos-inscritos', [EventoController::class, 'misEventosInscritos']);

    // Valoraciones (Crear, Editar y Borrar)
    Route::post('/protectoras/{id}/valorar', [ValoracionController::class, 'store']);
    Route::put('/valoraciones/{id}', [ValoracionController::class, 'update']);
    Route::delete('/valoraciones/{id}', [ValoracionController::class, 'destroy']);

    // Notificaciones
    Route::get('/notificaciones', fn(Request $request) => response()->json($request->user()->unreadNotifications));
    Route::post('/notificaciones/marcar-leidas', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Leídas']);
    });
});