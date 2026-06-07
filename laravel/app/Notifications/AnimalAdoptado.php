<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue; 

/**
 * Notificación para informar a los usuarios que un animal que han apadrinado ha sido adoptado.
 * Esta notificación se envía tanto por correo electrónico como se almacena en la base de datos
 * para ser mostrada en la interfaz de usuario (React).
 */
class AnimalAdoptado extends Notification implements ShouldQueue 
{
    use Queueable;

    public $animal;

    public function __construct($animal)
    {
        $this->animal = $animal;
    }

    public function via($notifiable): array
    {
        
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('¡Buenas noticias! ' . $this->animal->nombre . ' ha sido adoptado 🎉🐾')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Queremos hacerte partícipe de una de las noticias más felices para nuestra comunidad:')
            ->line('**' . $this->animal->nombre . '**, el peludito que has estado apoyando e impulsando con tanto cariño a través de tu apadrinamiento, ¡ha encontrado por fin una familia definitiva y ha sido adoptado! 🎉')
            ->line('Tu ayuda mensual ha sido clave para garantizar sus cuidados, alimentación y bienestar mientras esperaba este gran momento. Desde Huellitas y en nombre de su protectora, no tenemos palabras para agradecerte tu enorme solidaridad.')
            ->action('Ver mi panel de Huellitas', url('https://huellitasweb.es/login'))
            ->line('Tu suscripción de apadrinamiento para este peludito se dará por concluida, pero te invitamos a seguir conociendo a otros compañeros en el catálogo que aún necesitan tu apoyo.')
            ->salutation('¡Gracias por ayudarnos a salvar vidas! Un fuerte abrazo. 🐾');
    }

    public function toArray($notifiable): array
    {
        return [
            'animal_id' => $this->animal->id,
            'nombre' => $this->animal->nombre,
            'mensaje' => '¡Buenas noticias! ' . $this->animal->nombre . ' ha encontrado una familia y ha sido adoptado. ¡Gracias por haberlo apadrinado!',
            'imagen_url' => $this->animal->imagen_url,
        ];
    }
}