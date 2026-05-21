<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NuevaSolicitudAdopcion extends Notification
{
    use Queueable;

    protected $adopcion, $animal, $solicitante;

    public function __construct($adopcion, $animal, $solicitante)
    {
        $this->adopcion = $adopcion;
        $this->animal = $animal;
        $this->solicitante = $solicitante;
    }

    public function via($notifiable)
    {
        return ['database']; // Se guardará en la tabla 'notifications' de Laravel
    }

    public function toArray($notifiable)
    {
        return [
            'titulo' => 'Nueva solicitud de adopción',
            'mensaje' => "El usuario {$this->solicitante->name} quiere adoptar a {$this->animal->nombre}.",
            'adopcion_id' => $this->adopcion->id,
            'url' => '/panel-protectora'
        ];
    }
}