<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AnimalAdoptado extends Notification
{
    use Queueable;

    public $animal;

    public function __construct($animal)
    {
        $this->animal = $animal;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'animal_id' => $this->animal->id,
            'nombre' => $this->animal->nombre,
            'mensaje' => '¡Buenas noticias! ' . $this->animal->nombre . ' ha encontrado una familia y ha sido adoptado. ¡Gracias por haberlo apadrinado!',
            'imagen_url' => $this->animal->imagen_url,
        ];
    }
}