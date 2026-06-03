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
     * @param Animal $animal Instancia de la entidad que cambia de estado.
     */
    public function __construct(Animal $animal)
    {
        $this->animal = $animal;
    }

    /**
     * Define los canales de transmisión válidos para la notificación.
     * @param mixed $notifiable Entidad receptora de la notificación.
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['database'];
    }

    /**
     * Define la estructura de datos que se almacenará de forma persistente en la base de datos.
     * Genera el mapa asociativo con los metadatos requeridos por la interfaz del cliente.
     * @param mixed $notifiable Entidad receptora de la notificación.
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'titulo' => 'Actualizacion sobre el animal apadrinado',
            'mensaje' => "El animal que estaba apadrinando ({$this->animal->nombre}) ha sido adoptado oficialmente por una familia definitiva. El acuerdo de apadrinamiento asociado se ha cancelado de forma automatica en el sistema.",
            'animal_id' => $this->animal->id,
            'tipo' => 'adopcion_padrino'
        ];
    }
}