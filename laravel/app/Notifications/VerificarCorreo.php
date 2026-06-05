<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

class VerificarCorreo extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        // Generamos la URL firmada de verificación
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        return (new MailMessage)
            ->subject('Confirma tu cuenta en Huellitas 🐾')
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('Gracias por unirte a nuestra comunidad. Solo te queda un paso para empezar a adoptar y apuntarte a eventos.')
            ->line('Por favor, haz clic en el botón de abajo para verificar tu dirección de correo electrónico:')
            ->action('Verificar mi correo', $verificationUrl)
            ->line('Si tú no has creado esta cuenta, puedes ignorar este mensaje de forma segura.')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}