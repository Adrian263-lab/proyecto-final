<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

/**
 * Notificación para informar a los usuarios que su protectora ha sido aceptada y validada por un administrador.
 * Esta notificación se envía por correo electrónico con un enlace de verificación para activar la cuenta.
 */
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
        // 1. Generamos la URL firmada de verificación idéntica a la nativa de Laravel
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        // 2. Construimos el correo y le pasamos la variable $verificationUrl al botón
        return (new MailMessage)
            ->subject('¡Tu protectora ha sido validada en Huellitas! 🐾')
            ->greeting('¡Buenas noticias!')
            ->line('Nos alegra comunicarte que un administrador ha revisado y aprobado tu solicitud de registro para "' . $notifiable->name . '".')
            ->line('Para completar el proceso y activar tu cuenta, haz clic en el siguiente botón para verificar tu correo electrónico:')
            ->action('Verificar Correo e Iniciar Sesión', $verificationUrl)
            ->line('¡Muchas gracias por unirte a nuestra comunidad y ayudarnos a salvar vidas!')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}