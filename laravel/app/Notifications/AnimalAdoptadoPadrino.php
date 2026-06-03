<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Animal;

/**
 * Clase de notificación para informar de manera automatizada a los padrinos
 * que el animal vinculado a sus aportaciones ha sido adoptado oficialmente.
 */
class AnimalAdoptadoPadrino extends Notification
{
    use Queueable;

    /**
     * Instancia del modelo Animal objeto de la adopción.
     * @var Animal
     */
    protected $animal;

    /**
     * Inicializa una nueva instancia de la notificación.
     * @param Animal $animal
     */
    public function __construct(Animal $animal)
    {
        $this->animal = $animal;
    }

    /**
     * Define los canales de transmisión válidos para la notificación.
     * @param mixed $notifiable
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['database'];
    }

    /**
     * Define la estructura de datos que se almacenará de forma persistente en la base de datos.
     * @param mixed $notifiable
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'titulo' => '¡Buenas noticias sobre un peludito! 🎉',
            'mensaje' => "El animal que estabas apadrinando ({$this->animal->nombre}) ha sido adoptado oficialmente y ya tiene una familia definitiva. Tu apadrinamiento se ha cancelado automáticamente. ¡Gracias por tu apoyo continuo!",
            'animal_id' => $this->animal->id,
            'tipo' => 'adopcion_padrino'
        ];
    }
}