<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * Casting de atributos.
     * Esto permite que Laravel convierta el string de la BD 
     * automáticamente a un objeto Carbon (fecha) de PHP.
     */
    protected $casts = [
        'fecha' => 'datetime', // Debe llamarse igual que en $fillable
    ];

    /**
     * Relación: Un evento pertenece a una protectora (User)
     */
    public function protectora(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}