<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Notificación para informar a los administradores que se ha recibido una nueva solicitud de adopción.
 * Esta notificación se almacena en la base de datos para ser mostrada en la interfaz de usuario (React).
 */

class NuevaSolicitudAdopcion extends Notification
{
    use Queueable;

    public $adopcion;
    public $animal;
    public $adoptante;

    
    public function __construct($adopcion, $animal, $adoptante)
    {
        $this->adopcion = $adopcion;
        $this->animal = $animal;
        $this->adoptante = $adoptante;
    }

    
    public function via($notifiable)
    {
        
        return ['database'];
    }

    
    public function toArray($notifiable)
    {
        return [
            'titulo' => '🐾 Nueva Solicitud de Adopción',
            'tipo' => 'nueva_solicitud',
            'mensaje' => $this->adoptante->name . ' ha enviado una solicitud de adopción para ' . $this->animal->nombre . '.',
            'adopcion_id' => $this->adopcion->id,
            'animal_id' => $this->animal->id,
            'animal_nombre' => $this->animal->nombre,
            'adoptante_nombre' => $this->adoptante->name,
        ];
    }
}