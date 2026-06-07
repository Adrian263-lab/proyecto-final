<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; 

/**
 * Notificación para informar a los usuarios que su solicitud de adopción ha sido rechazada.
 * Esta notificación se envía tanto por correo electrónico como se almacena en la base de datos
 * para ser mostrada en la interfaz de usuario (React).
 */
class AdopcionRechazada extends Notification implements ShouldQueue 
{
    use Queueable;

    protected $adopcion;

    
    public function __construct($adopcion)
    {
        $this->adopcion = $adopcion;
    }

    
    public function via(object $notifiable): array
    {
        
        return ['database', 'mail'];
    }

    
    public function toMail(object $notifiable): MailMessage
    {
        $nombreAnimal = $this->adopcion->animal->nombre ?? 'el peludito';

        return (new MailMessage)
            ->subject('Actualización sobre tu solicitud de adopción 🐾')
            ->greeting('Hola, ' . $notifiable->name)
            ->line('Te escribimos para comunicarte que, tras revisar detalladamente el cuestionario, la protectora ha decidido rechazar tu solicitud de adopción para **' . $nombreAnimal . '**.')
            ->line('Gestionar este tipo de decisiones es muy complejo para los refugios, ya que buscan perfiles que se adapten al 100% a las necesidades específicas, traumas o comportamientos de cada animal en concreto.')
            ->line('Si deseas conocer los motivos detallados o crees que ha habido algún malentendido con los datos de tu vivienda o experiencia, puedes ponerte en contacto con nosotros respondiendo directamente a este correo.')
            ->action('Ir a la página', url('https://huellitasweb.es/login'))
            ->salutation('Agradecemos enormemente tu interés por la adopción. Un saludo del equipo de Huellitas. 🐾');
    }

    
    public function toArray(object $notifiable): array
    {
        return [
            
            'titulo' => '❌ Solicitud Rechazada', 
            'tipo' => 'adopcion_rechazada',
            'adopcion_id' => $this->adopcion->id,
            'animal_id' => $this->adopcion->animal_id,
            'animal_nombre' => $this->adopcion->animal->nombre ?? 'el peludito',
            'mensaje' => "Lo sentimos, tu solicitud para adoptar a " . ($this->adopcion->animal->nombre ?? 'el peludito') . " ha sido rechazada. Para más información, por favor contacta con la protectora vía email.",
        ];
    }
}