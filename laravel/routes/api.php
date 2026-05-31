<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;

// Controladores
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

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
| RUTAS PROTEGIDAS
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
        Route::get('/avisos', fn() => DB::table('admin_notifications')->where('leido', 0)->orderBy('created_at', 'desc')->get());
        
        Route::put('/validar/{id}', function($id) {
            $user = User::findOrFail($id);
            $user->update(['validado' => true]);
            DB::table('admin_notifications')->where('user_id', $id)->delete();
            return response()->json(['message' => 'Protectora validada']);
        });
        
        // BORRADO SEGURO (Limpia relaciones antes de borrar el usuario)
        Route::delete('/rechazar/{id}', function($id) {
            // Borramos registros asociados para evitar errores de llave foránea
            DB::table('animales')->where('user_id', $id)->delete();
            DB::table('eventos')->where('user_id', $id)->delete();
            DB::table('valoraciones')->where('user_id', $id)->orWhere('protectora_id', $id)->delete();
            
            // Finalmente borramos el usuario y su notificación
            User::findOrFail($id)->delete();
            DB::table('admin_notifications')->where('user_id', $id)->delete();
            
            return response()->json(['message' => 'Solicitud rechazada y datos limpiados']);
        });
        
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
    });

    // --- 2. ZONA PROTECTORA ---
    // (Resto de tus rutas se mantienen igual...)
    Route::get('/mis-animales', [AnimalController::class, 'misAnimales']);
    Route::post('/animales', [AnimalController::class, 'store']);
    Route::put('/animales/{id}', [AnimalController::class, 'update']);
    Route::delete('/animales/{id}', [AnimalController::class, 'destroy']);
    Route::put('/animales/revertir/{id}', [AnimalController::class, 'revertirAdopcion']);

    Route::get('/mis-eventos', [EventoController::class, 'misEventos']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::put('/eventos/{id}', [EventoController::class, 'update']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    Route::get('/protectora/solicitudes', [AdopcionController::class, 'pendientesProtectora']);
    Route::put('/protectora/adopciones/aprobar/{id}', [AdopcionController::class, 'aprobar']);
    Route::put('/protectora/adopciones/rechazar/{id}', [AdopcionController::class, 'rechazar']);

    // --- 3. ZONA PARTICULAR ---
    Route::get('/mis-apadrinamientos', [ApadrinamientoController::class, 'misApadrinamientos']);
    Route::post('/apadrinar', [ApadrinamientoController::class, 'store']);
    Route::post('/adoptar', [AdopcionController::class, 'store']);
    
    Route::post('/eventos/{id}/inscribirse', [EventoController::class, 'inscribirse']);
    Route::delete('/eventos/{id}/desinscribirse', [EventoController::class, 'desinscribirse']);
    Route::get('/eventos/{id}/check-inscripcion', [EventoController::class, 'checkInscripcion']);
    Route::get('/mis-eventos-inscritos', [EventoController::class, 'misEventosInscritos']);
    
    Route::post('/protectoras/{id}/valorar', [ValoracionController::class, 'store']);
    Route::put('/valoraciones/{id}', [ValoracionController::class, 'update']);
    Route::delete('/valoraciones/{id}', [ValoracionController::class, 'destroy']);
    
    Route::get('/notificaciones', fn(Request $request) => response()->json($request->user()->unreadNotifications));
    Route::post('/notificaciones/marcar-leidas', fn(Request $request) => $request->user()->unreadNotifications->markAsRead());
});