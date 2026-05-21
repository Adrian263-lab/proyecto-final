<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Adopcion extends Model
{
    use HasFactory;

    protected $table = 'adopciones';

    protected $fillable = [
        'user_id', 'animal_id', 'tipo_vivienda', 'tiene_jardin', 
        'otras_mascotas', 'horas_solo', 'motivo', 'estado'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}