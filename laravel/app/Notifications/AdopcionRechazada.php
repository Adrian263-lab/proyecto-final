<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; // 🚀 Importación obligatoria para colas

class AdopcionRechazada extends Notification implements ShouldQueue // 🚀 Implementamos la interfaz
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
     */
    public function via(object $notifiable): array
    {
        // Se guarda en DB para el panel de React y se encola para el envío SMTP
        return ['database', 'mail'];
    }

    /**
     * Redacción del correo electrónico.
     */
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

    /**
     * Representación para la base de datos (Frontend).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'titulo' => 'Solicitud de adopción actualizada',
            'mensaje' => "Lo sentimos, tu solicitud para adoptar a " . ($this->adopcion->animal->nombre ?? 'el peludito') . " ha sido rechazada. Para más información, por favor contacta con la protectora vía email.",
            'animal_id' => $this->adopcion->animal_id
        ];
    }
}