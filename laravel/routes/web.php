<?php

use App\Http\Controllers\AnimalController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\AdiestradorController;
use Illuminate\Support\Facades\Route;

// Rutas públicas (cualquiera puede ver animales y eventos)
Route::get('/', function () { return view('welcome'); });
Route::get('/animales', [AnimalController::class, 'index'])->name('animales.index');
Route::get('/animales/{animal}', [AnimalController::class, 'show'])->name('animales.show');
Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');

// Rutas protegidas (Solo para usuarios logueados)
Route::middleware(['auth'])->group(function () {
    
    // Gestión de Animales (Crear, editar, borrar)
    Route::resource('admin/animales', AnimalController::class)->except(['index', 'show']);
    
    // Gestión de Eventos
    Route::resource('admin/eventos', EventoController::class)->except(['index']);
    
    // Perfil de usuario / protectora
    Route::get('/perfil', [UserController::class, 'edit'])->name('profile.edit');
    Route::put('/perfil', [UserController::class, 'update'])->name('profile.update');
    
    // Rutas específicas para Adiestradores
    Route::resource('adiestradores', AdiestradorController::class);
});
