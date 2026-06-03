<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Animal;

class AnimalAdoptadoPadrino extends Notification
{
    use Queueable;

    protected $animal;

    /**
     * Crear una nueva instancia de la notificación.
     */
    public function __construct(Animal $animal)
    {
        $this->animal = $animal;
    }

    /**
     * Canales de envío de la notificación (Base de datos y opcionalmente Correo).
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Representación por correo electrónico.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('¡Buenas noticias sobre tu peludito apadrinado! ❤️')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Te escribimos para darte una noticia maravillosa: ' . $this->animal->nombre . ', el peludito al que estabas apoyando con tanto amor, ¡ha sido adoptado oficialmente!')
            ->line('Gracias a tu generosa ayuda económica mensuales, ha podido estar bien cuidado hasta encontrar su hogar definitivo.')
            ->line('Por este motivo, hemos cancelado automáticamente tu suscripción de apadrinamiento para que no se te pasen más cuotas.')
            ->action('Ver otros animales que necesitan ayuda', url(env('FRONTEND_URL', 'https://huellitasweb.es') . '/animales'))
            ->line('¡Gracias por formar parte del motor de Huellitas!');
    }

    /**
     * Estructura del payload JSON que se guardará en la tabla 'notifications' para React.
     */
    public function toArray($notifiable)
    {
        return [
            'message' => '¡Tu peludito apadrinado ' . $this->animal->nombre . ' ha sido adoptado! Su suscripción ha sido cancelada.',
            'animal_id' => $this->animal->id,
            'animal_nombre' => $this->animal->nombre,
            'tipo' => 'apadrinamiento_cancelado_adopcion'
        ];
    }
}