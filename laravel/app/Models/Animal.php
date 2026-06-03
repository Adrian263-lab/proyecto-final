<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Representacion de la entidad Animal en el sistema.
 * Gestiona el estado de los animales, sus datos descriptivos y mapea
 * las relaciones de persistencia con especies, protectores y padrinos.
 */
class Animal extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla asociada en la base de datos.
     * @var string
     */
    protected $table = 'animals';

    /**
     * Atributos habilitados para el proceso de asignacion masiva.
     * @var array<int, string>
     */
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
     * Relacion inversa polimorfica o directa con la entidad protectora (User).
     * Define la pertenencia del animal a una institucion o albergue especifico.
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relacion directa con el modelo Especie.
     * Clasifica taxonicamente al animal dentro de la plataforma (por ejemplo, Perro o Gato).
     * @return BelongsTo
     */
    public function especie(): BelongsTo
    {
        return $this->belongsTo(Especie::class);
    }

    /**
     * Relacion de uno a muchos con el modelo Apadrinamiento.
     * Permite consultar el registro historico y contable de transacciones de aportacion del animal.
     * @return HasMany
     */
    public function apadrinamientos(): HasMany
    {
        return $this->hasMany(Apadrinamiento::class);
    }

    /**
     * Relacion de muchos a muchos con el modelo de usuarios (Padrinos).
     * Mapea la relacion intermedia a traves de la tabla pivote 'apadrinamientos'
     * para la extraccion directa de usuarios con el fin de despachar notificaciones.
     * @return BelongsToMany
     */
    public function padrinos(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'apadrinamientos', 'animal_id', 'user_id');
    }
}
