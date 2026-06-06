<?php

namespace Database\Factories;

use App\Models\Evento;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventoFactory extends Factory
{
    protected $model = Evento::class;

    public function definition(): array
    {
        $fotosEventos = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'
        ];

        // Selección limpia de imagen
        $imagenAleatoria = $fotosEventos[array_rand($fotosEventos)];

        // Generamos un timestamp aleatorio entre el 1 de junio y el 31 de julio de 2026
        $inicio = strtotime('2026-06-01 09:00:00');
        $fin = strtotime('2026-07-31 20:00:00');
        $fechaAleatoria = date('Y-m-d H:i:s', mt_rand($inicio, $fin));

        return [
            'titulo' => 'Evento Genérico',
            'descripcion' => 'Actividad especial organizada para recaudar fondos y concienciar sobre la adopción responsable de animales.',
            'fecha' => $fechaAleatoria,
            'ubicacion' => 'Instalaciones del centro colaborador',
            'imagen_url' => $imagenAleatoria,
        ];
    }
}