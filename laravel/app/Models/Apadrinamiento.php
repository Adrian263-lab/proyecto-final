<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Representacion de la entidad Apadrinamiento en el sistema.
 * Gestiona las relaciones de apadrinamiento entre usuarios y animales, almacenando
 * informacion relevante para el seguimiento de cada padrino y su contribucion mensual.
 */
class Apadrinamiento extends Model
{
    use HasFactory;

    // Tabla asociada a este modelo
    protected $table = 'apadrinamientos';

    // Campos que permitimos rellenar en masa
    protected $fillable = [
        'user_id',
        'animal_id',
        'cuota_mensual', 
        'fecha_inicio',
        'activo'
    ];

    // Relación: Un apadrinamiento pertenece a un animal
    public function animal()
    {
        return $this->belongsTo(Animal::class, 'animal_id');
    }

    // Relación: Un apadrinamiento pertenece a un usuario (padrino)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
