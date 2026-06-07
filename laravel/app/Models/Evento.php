<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Representacion de la entidad Evento en el sistema.
 * Gestiona los eventos organizados por las protectoras, almacenando informacion
 * relevante como fecha, ubicacion y descripcion, y mapeando las relaciones con
 * los usuarios inscritos y la protectora organizadora.
 */
class Evento extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha',      // Unificado a 'fecha'
        'ubicacion',
        'user_id',
        'imagen_url'
    ];

    // Cast para convertir 'fecha' a un objeto Carbon automáticamente
    protected $casts = [
        'fecha' => 'datetime', 
    ];

    // Relación: Un evento tiene muchos usuarios inscritos
    public function inscritos()
    {
        return $this->belongsToMany(User::class, 'evento_user', 'evento_id', 'user_id')
            ->withTimestamps();
    }

    // Relacion con el modelo User (Protectora organizadora)
    public function protectora(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}