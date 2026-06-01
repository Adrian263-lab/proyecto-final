<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevaSolicitudAdopcion extends Notification
{
    use Queueable;

    protected $adopcion, $animal, $solicitante;

    public function __construct($adopcion, $animal, $solicitante)
    {
        $this->adopcion = $adopcion;
        $this->animal = $animal;
        $this->solicitante = $solicitante;
    }

    public function via($notifiable): array
    {
        // 🚀 Combo completo: Alerta interna en React + Email corporativo real por IONOS
        return ['database', 'mail'];
    }

    /**
     * 📬 Redacción del correo electrónico enviado a la Protectora
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🐾 Nueva solicitud de adopción recibida - ' . $this->animal->nombre)
            ->greeting('¡Hola, ' . $notifiable->name . '!')
            ->line('¡Grandes noticias! Un usuario ha mostrado un gran interés por uno de vuestros peluditos.')
            ->line('**' . $this->solicitante->name . '** ha rellenado el formulario de adopción para intentar darle un hogar definitivo a **' . $this->animal->nombre . '**.')
            ->line('Ya tenéis disponible el cuestionario completo con sus datos de vivienda, teléfono de contacto y motivaciones listo para ser evaluado desde vuestra zona privada.')
            ->action('Revisar Solicitud en el Panel', url('https://huellitasweb.es/login'))
            ->line('Gracias por la increíble labor que hacéis cada día cuidando de ellos.')
            ->salutation('Un saludo del equipo de Huellitas. 🐾');
    }

    public function toArray($notifiable): array
    {
        // Mantenemos tu array original exactamente igual para no alterar los mapeos de tu frontend
        return [
            'titulo' => 'Nueva solicitud de adopción',
            'mensaje' => "El usuario {$this->solicitante->name} quiere adoptar a {$this->animal->nombre}.",
            'adopcion_id' => $this->adopcion->id,
            'url' => '/panel-protectora'
        ];
    }
}