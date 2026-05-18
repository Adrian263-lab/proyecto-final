<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Animal extends Model
{
    // IMPORTANTE: Definimos el nombre real de la tabla en tu BD
    protected $table = 'animals';

    // Usamos la propiedad protegida estándar para evitar errores de asignación masiva
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

    /**
     * Relación con la protectora (Usuario)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con la especie
     */
    public function especie(): BelongsTo
    {
        return $this->belongsTo(Especie::class);
    }

    /**
     * Relación con apadrinamientos
     */
    public function apadrinamientos(): HasMany
    {
        return $this->hasMany(Apadrinamiento::class);
    }
}
