<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail; 
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

/**
 * Representacion de la entidad User en el sistema.
 * Gestiona tanto a los usuarios particulares como a las protectoras, diferenciados por el campo 'rol',
 * y mapea las relaciones con animales, eventos, adopciones y valoraciones para facilitar su gestión y consulta.
 */

#[Fillable([
    'name',
    'email',
    'password',
    'rol',
    'cif',
    'direccion',
    'telefono',
    'descripcion',
    'logo_url',
    'especialidad',
    'zona_geografica',
    'validado',
    'latitud',
    'longitud'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail 
{
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'validado' => 'boolean', 
        ];
    }

    
// Relaciones 
    public function protectorasFavoritas(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'protectora_favorita', 'user_id', 'protectora_id')
            ->withTimestamps();
    }

    public function eventosInscritos()
    {
        return $this->belongsToMany(Evento::class, 'evento_user', 'user_id', 'evento_id')
            ->withTimestamps();
    }

    public function animales(): HasMany
    {
        return $this->hasMany(Animal::class, 'user_id');
    }

    public function apadrinamientos(): HasMany
    {
        return $this->hasMany(Apadrinamiento::class, 'user_id');
    }

    public function eventos(): HasMany
    {
        return $this->hasMany(Evento::class, 'user_id');
    }

    public function valoraciones(): HasMany
    {
        return $this->hasMany(Valoracion::class, 'protectora_id');
    }

    public function sendEmailVerificationNotification()
    {
        
        $this->notify(new \App\Notifications\VerificarCorreo);
    }
}