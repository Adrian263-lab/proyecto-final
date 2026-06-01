<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ProtectoraRechazada extends Notification implements ShouldQueue
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
            ->subject('Actualización sobre tu solicitud en Huellitas 🐾')
            ->greeting('Hola,')
            ->line('Lamentamos informarte que tu solicitud de registro como protectora para "' . $notifiable->name . '" no ha podido ser aprobada en esta ocasión.')
            ->line('Si crees que ha sido un error o deseas aportar documentación adicional, no dudes en responder a este correo.')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}