<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

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
    'validado'
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; 

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'validado' => 'boolean', // Casteamos a boolean para facilitar el uso en React
        ];
    }

    /**
     * RELACIONES
     */

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
}