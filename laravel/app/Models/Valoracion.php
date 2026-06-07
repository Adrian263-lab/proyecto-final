<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Representacion de la entidad Valoracion en el sistema.
 * Gestiona las valoraciones que los usuarios particulares pueden dejar sobre las protectoras,
 * almacenando la puntuacion, comentario y mapeando las relaciones con el usuario que la escribió
 * y la protectora que la recibió para facilitar su consulta y gestión.
 */
class Valoracion extends Model
{
    use HasFactory;

    // Especificamos la tabla si no sigue la convención de nombre (opcional si la tabla es 'valoraciones')
    protected $table = 'valoraciones';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'user_id',
        'protectora_id',
        'puntuacion',
        'comentario'
    ];

    /**
     * Relación: La valoración pertenece al usuario (particular) que la escribió
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación: La valoración pertenece a la protectora que la recibió
     */
    public function protectora(): BelongsTo
    {
        return $this->belongsTo(User::class, 'protectora_id');
    }
}