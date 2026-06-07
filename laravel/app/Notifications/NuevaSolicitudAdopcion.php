<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NuevaSolicitudAdopcion extends Notification
{
    use Queueable;

    public $adopcion;
    public $animal;
    public $adoptante;

    /**
     * Create a new notification instance.
     */
    public function __construct($adopcion, $animal, $adoptante)
    {
        $this->adopcion = $adopcion;
        $this->animal = $animal;
        $this->adoptante = $adoptante;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        // Forzamos el canal database para que se guarde en la tabla notifications
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        return [
            'titulo' => '🐾 Nueva Solicitud de Adopción', // <-- Añadimos el título exacto aquí
            'tipo' => 'nueva_solicitud',
            'mensaje' => $this->adoptante->name . ' ha enviado una solicitud de adopción para ' . $this->animal->nombre . '.',
            'adopcion_id' => $this->adopcion->id,
            'animal_id' => $this->animal->id,
            'animal_nombre' => $this->animal->nombre,
            'adoptante_nombre' => $this->adoptante->name,
        ];
    }
}