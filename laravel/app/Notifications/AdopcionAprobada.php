namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdopcionAprobada extends Notification
{
    use Queueable;

    protected $adopcion;

    public function __construct($adopcion)
    {
        $this->adopcion = $adopcion;
    }

    public function via($notifiable)
    {
        return ['database']; // Esto guarda el aviso en la tabla 'notifications'
    }

    public function toDatabase($notifiable)
    {
        return [
            'mensaje' => '¡Buenas noticias! Tu solicitud para adoptar a ' . $this->adopcion->animal->nombre . ' ha sido aprobada.',
            'adopcion_id' => $this->adopcion->id,
        ];
    }
}