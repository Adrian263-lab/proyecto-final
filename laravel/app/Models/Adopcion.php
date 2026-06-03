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

    /**
     * Nombre de la tabla asociada en la base de datos.
     * @var string
     */
    protected $table = 'adopciones';

    /**
     * Atributos habilitados para el proceso de asignacion masiva.
     * @var array<int, string>
     */
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

    /**
     * Relacion inversa de uno a muchos con el modelo de usuarios (User).
     * Identifica al usuario solicitante o adoptante que rellena el cuestionario.
     * 🔄 CORREGIDO: Apunta a User::class para que coincida con tu estructura real de archivos.
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relacion inversa de uno a muchos con el modelo Animal.
     * Vincula la solicitud de adopcion con el especimen concreto objeto del expediente.
     * @return BelongsTo
     */
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }
}