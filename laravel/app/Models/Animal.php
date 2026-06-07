<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Representacion de la entidad Animal en el sistema.
 * Gestiona el estado de los animales, sus datos descriptivos y mapea
 * las relaciones de persistencia con especies, protectores y padrinos.
 */
class Animal extends Model
{
    use HasFactory;

    
    protected $table = 'animals';

    
    protected $fillable = [
        'user_id', 
        'especie_id', 
        'nombre', 
        'raza', 
        'sexo', 
        'estado', 
        'descripcion', 
        'imagen_url'
    ];

    // Relacion con el modelo User (Protector)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relacion con el modelo Especie
    public function especie(): BelongsTo
    {
        return $this->belongsTo(Especie::class);
    }

    // Relacion con el modelo Apadrinamiento
    public function apadrinamientos(): HasMany
    {
        return $this->hasMany(Apadrinamiento::class);
    }

    // Relacion con el modelo User (Padrinos) a través de la tabla intermedia 'apadrinamientos'
    public function padrinos(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'apadrinamientos', 'animal_id', 'user_id');
    }
}
