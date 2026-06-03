<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdopcionRechazada extends Notification
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
        // 🚀 Combo perfecto: Se registra en tu tabla local y se despacha por el SMTP real de IONOS
        return ['database', 'mail'];
    }

    /**
     * 📬 Redacción del correo electrónico real enviado por IONOS
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
            ->action('Ir a la pagina', url('https://huellitasweb.es/login'))
            ->salutation('Agradecemos enormemente tu interés por la adopción. Un saludo del equipo de Huellitas. 🐾');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        // Mantenemos tu array original intacto para no alterar los mapeos de tu frontend en React
        return [
            'titulo' => 'Solicitud de adopción actualizada',
            'mensaje' => "Lo sentimos, tu solicitud para adoptar a " . ($this->adopcion->animal->nombre ?? 'el peludito') . " ha sido rechazada. Para más información, por favor contacta con la protectora via email.",
            'animal_id' => $this->adopcion->animal_id
        ];
    }
}