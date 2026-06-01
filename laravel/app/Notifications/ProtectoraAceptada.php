<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ProtectoraAceptada extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('¡Tu protectora ha sido validada en Huellitas! 🐾')
            ->greeting('¡Buenas noticias!')
            ->line('Nos alegra comunicarte que un administrador ha revisado y aprobado tu solicitud de registro para "' . $notifiable->name . '".')
            ->line('A partir de este momento, tu cuenta está completamente activa.')
            ->action('Iniciar Sesión en el Portal', url('https://huellitasweb.es/login'))
            ->line('¡Muchas gracias por unirte a nuestra comunidad y ayudarnos a salvar vidas!')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}