<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Representacion de la entidad Especie en el sistema.
 * Gestiona las especies de animales disponibles en el refugio, permitiendo
 * mapear la relacion con los animales asociados a cada especie para facilitar su consulta y organizacion.
 */

#[Fillable(['nombre'])]
class Especie extends Model
{
    use HasFactory;

   
    public function animales(): HasMany
    {
        return $this->hasMany(Animal::class, 'especie_id');
    }
}
