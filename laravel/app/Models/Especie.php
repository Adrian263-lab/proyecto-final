<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['nombre'])]
class Especie extends Model
{
    use HasFactory;

    /**
     * RELACIONES
     */

    /**
     * Una especie (ej: Perro) tiene muchos animales asociados.
     * Esto te permitirá hacer: $especie->animales
     */
    public function animales(): HasMany
    {
        return $this->hasMany(Animal::class, 'especie_id');
    }
}
