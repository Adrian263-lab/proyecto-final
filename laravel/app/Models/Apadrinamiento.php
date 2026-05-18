<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'animal_id', 'cuota_mensual', 'fecha_inicio', 'activo'])]
class Apadrinamiento extends Model
{
    // Relación: El apadrinamiento pertenece a un usuario
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación: El apadrinamiento pertenece a un animal
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class, 'animal_id');
    }
}
