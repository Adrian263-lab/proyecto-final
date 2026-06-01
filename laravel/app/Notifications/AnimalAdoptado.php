<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AnimalAdoptado extends Notification
{
    use Queueable;

    public $animal;

    public function __construct($animal)
    {
        $this->animal = $animal;
    }

    public function via($notifiable): array
    {
        // 🚀 Registramos en tu tabla local para React y enviamos correo real por IONOS
        return ['database', 'mail'];
    }

    /**
     * 📬 Redacción del correo electrónico real enviado por IONOS al padrino
     */
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

    public function toDatabase($notifiable): array
    {
        // Mantenemos tu array e interfaz original intacta para que React lo pinte clavado
        return [
            'animal_id' => $this->animal->id,
            'nombre' => $this->animal->nombre,
            'mensaje' => '¡Buenas noticias! ' . $this->animal->nombre . ' ha encontrado una familia y ha sido adoptado. ¡Gracias por haberlo apadrinado!',
            'imagen_url' => $this->animal->imagen_url,
        ];
    }
}