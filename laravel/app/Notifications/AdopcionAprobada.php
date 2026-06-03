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
        // Recibimos la relación completa de la adopción
        $this->adopcion = $adopcion;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // 🚀 LA CLAVE: Devolvemos 'database' para tu React Y 'mail' para el correo real de IONOS
        return ['database', 'mail'];
    }

    /**
     * Representación por correo electrónico de la adopción aprobada.
     * 🔄 CORREGIDO: Botón adaptado a "Visitar la página web" con redirección limpia.
     */
    public function toMail($notifiable)
    {
        $frontendUrl = env('FRONTEND_URL', 'https://huellitasweb.es');

        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('¡Buenas noticias! Tu solicitud de adopción ha sido aprobada 🎉')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Tenemos una noticia maravillosa: tu solicitud para adoptar a ' . $this->adopcion->animal->nombre . ' ha sido revisada y aprobada oficialmente por la protectora.')
            ->line('En los próximos días se pondrán en contacto contigo a través del teléfono o dirección que indicaste en el cuestionario para formalizar los trámites y coordinar el encuentro.')
            ->action('Visitar la página web', url($frontendUrl)) // 🌟 CAMBIO AQUÍ
            ->line('Muchísimas gracias por elegir la adopción responsable y darle una segunda oportunidad a quien más lo necesita.')
            ->line('Un saludo del equipo de Huellitas. 🐾');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        // Mantenemos tu estructura original intacta para que tu frontend en React no rompa al mapear
        return [
            'adopcion_id' => $this->adopcion->id,
            'mensaje' => '¡Felicidades! Tu solicitud para adoptar a ' . ($this->adopcion->animal->nombre ?? 'tu peludito') . ' ha sido aprobada. Nos pondremos en contacto contigo via email para coordinar los siguientes pasos.',
            'url' => '/mis-apadrinamientos'
        ];
    }
}