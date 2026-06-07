<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Notificación para informar a los usuarios que su solicitud de adopción ha sido aprobada.
 * Esta notificación se envía tanto por correo electrónico como se almacena en la base de datos
 * para ser mostrada en la interfaz de usuario (React).
 */
class AdopcionAprobada extends Notification implements ShouldQueue
{
    use Queueable;

    protected $adopcion;

    
    public function __construct($adopcion)
    {
        $this->adopcion = $adopcion;
    }

   
    public function via(object $notifiable): array
    {
        // Guardamos en DB para React y enviamos correo vía SMTP
        return ['database', 'mail'];
    }

    
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

    
    public function toArray(object $notifiable): array
    {
        return [
            
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