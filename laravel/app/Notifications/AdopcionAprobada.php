<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; // 🚀 Necesario para colas asíncronas

class AdopcionAprobada extends Notification implements ShouldQueue // 🚀 Implementamos la interfaz
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
        // Guardamos en DB para React y enviamos correo vía SMTP
        return ['database', 'mail'];
    }

    /**
     * Representación por correo electrónico.
     */
    public function toMail($notifiable)
    {
        $frontendUrl = env('FRONTEND_URL', 'https://huellitasweb.es');

        return (new MailMessage)
            ->subject('¡Buenas noticias! Tu solicitud de adopción ha sido aprobada 🎉')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Tenemos una noticia maravillosa: tu solicitud para adoptar a ' . $this->adopcion->animal->nombre . ' ha sido revisada y aprobada oficialmente por la protectora.')
            ->line('En los próximos días se pondrán en contacto contigo a través del teléfono o dirección que indicaste en el cuestionario para formalizar los trámites y coordinar el encuentro.')
            ->action('Visitar la página web', url($frontendUrl))
            ->line('Muchísimas gracias por elegir la adopción responsable y darle una segunda oportunidad a quien más lo necesita.')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    /**
     * Get the array representation for database storage (React).
     */
    public function toArray(object $notifiable): array
    {
        return [
            // Añadimos el título dinámico para la vista de notificaciones en React
            'titulo' => '🎉 ¡Adopción Aprobada!', 
            'tipo' => 'adopcion_aprobada',
            'adopcion_id' => $this->adopcion->id,
            'animal_id' => $this->adopcion->animal->id ?? null,
            'animal_nombre' => $this->adopcion->animal->nombre ?? 'tu peludito',
            'mensaje' => '¡Felicidades! Tu solicitud para adoptar a ' . ($this->adopcion->animal->nombre ?? 'tu peludito') . ' ha sido aprobada. Nos pondremos en contacto contigo vía email.',
            'url' => '/mis-apadrinamientos'
        ];
    }
}