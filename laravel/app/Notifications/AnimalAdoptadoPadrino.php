<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; // 🚀 Importación para colas
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Animal;

class AnimalAdoptadoPadrino extends Notification implements ShouldQueue // 🚀 Implementamos la interfaz
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
     * Canales de envío de la notificación (Base de datos y Correo).
     */
    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Representación por correo electrónico.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('¡Maravillosas noticias sobre tu peludito apadrinado! ❤️')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Te escribimos con una alegría inmensa: ' . $this->animal->nombre . ', el peludito al que has estado apoyando con tanto amor, ¡ha sido adoptado oficialmente y ya está con su familia definitiva!')
            ->line('Tu aportación mensual ha sido una pieza clave para que estuviera feliz, sano y bien cuidado hasta encontrar este hogar.')
            ->line('Queremos avisarte de que tu suscripción de apadrinamiento sigue activa en tu panel. Desde allí puedes decidir si deseas mantenerla o redirigir ese gran apoyo a cualquiera de los otros peluditos que todavía nos necesitan.')
            ->action('Gestionar mis apadrinamientos', url(env('FRONTEND_URL', 'https://huellitasweb.es') . '/panel'))
            ->line('¡Gracias por cambiar vidas y ser parte del motor de Huellitas!');
    }

    /**
     * Estructura del payload JSON para el frontend.
     */
    public function toArray($notifiable): array
    {
        return [
            'titulo' => '¡Actualización de apadrinamiento! 🐾',
            'mensaje' => '¡Tu peludito apadrinado ' . $this->animal->nombre . ' ha sido adoptado! Tu suscripción sigue activa por si deseas redirigir tu ayuda a otro compañero.',
            'animal_id' => $this->animal->id,
            'animal_nombre' => $this->animal->nombre,
            'tipo' => 'adopcion_padrino'
        ];
    }
}