<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdopcionRechazada extends Notification
{
    use Queueable;
    protected $adopcion;

    public function __construct($adopcion) {
        $this->adopcion = $adopcion;
    }

    public function via($notifiable) {
        return ['database'];
    }

    public function toArray($notifiable) {
        return [
            'titulo' => 'Solicitud de adopción actualizada',
            'mensaje' => "Lo sentimos, tu solicitud para adoptar a " . $this->adopcion->animal->nombre . " ha sido rechazada. Para más información, por favor contacta con la protectora via email.",
            'animal_id' => $this->adopcion->animal_id
        ];
    }
}