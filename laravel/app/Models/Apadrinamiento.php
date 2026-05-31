<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apadrinamiento extends Model
{
    use HasFactory;

    // Tabla asociada a este modelo
    protected $table = 'apadrinamientos';

    // Campos que permitimos rellenar en masa
    protected $fillable = [
        'user_id',
        'animal_id',
        'cuota_mensual', // Mapeado con la 'cantidad' de React
        'fecha_inicio',
        'activo'
    ];

    // Relación fundamental: Un apadrinamiento pertenece a un animal
    public function animal()
    {
        return $this->belongsTo(Animal::class, 'animal_id');
    }

    // Relación opcional: Un apadrinamiento pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
