<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdopcionAprobada extends Notification
{
    use Queueable;

    protected $adopcion;

    /**
     * Create a new notification instance.
     */
    public function __construct($adopcion)
    {
        $this->adopcion = $adopcion;
    }

    /**
     * Get the notification's delivery channels.
     * * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Usamos 'database' para que se guarde en la tabla 'notifications'
        // y el frontend pueda consultarlo a través de tu endpoint
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     * * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'adopcion_id' => $this->adopcion->id,
            'mensaje' => '¡Felicidades! Tu solicitud para adoptar a ' . $this->adopcion->animal->nombre . ' ha sido aprobada.',
            'url' => '/mis-apadrinamientos'
        ];
    }
}