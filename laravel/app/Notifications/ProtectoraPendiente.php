<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class ProtectoraPendiente extends Notification
{
    protected $protectora;

    public function __construct($protectora)
    {
        $this->protectora = $protectora;
    }

    public function via($notifiable)
    {
        return ['database']; // Guardamos en la base de datos
    }

    public function toArray($notifiable)
    {
        return [
            'mensaje' => 'Nueva protectora: ' . $this->protectora->name,
            'protectora_id' => $this->protectora->id
        ];
    }
}