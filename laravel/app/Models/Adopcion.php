<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Representacion de la entidad Adopcion en el sistema.
 * Almacena y gestiona las respuestas de los cuestionarios de adopcion enviados por
 * los usuarios particulares, asi como el estado de la tramitacion de cada expediente.
 */
class Adopcion extends Model
{
    use HasFactory;

   
    protected $table = 'adopciones';

  
    protected $fillable = [
        'user_id',
        'animal_id',
        'tipo_vivienda',
        'tiene_jardin',
        'otras_mascotas',
        'horas_solo',
        'motivo',
        'estado',
        'telefono',
        'experiencia'
    ];

  // Relacion con el modelo User (Adoptante)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relacion con el modelo Animal
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}