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

        // Selección limpia usando PHP nativo
        $imagenAleatoria = $fotosEventos[array_rand($fotosEventos)];

        return [
            'titulo' => 'Evento Genérico', // Se sobrescribe dinámicamente en el seeder
            'descripcion' => 'Actividad especial organizada para recaudar fondos y concienciar sobre la adopción responsable de animales.',
            'fecha' => '2026-06-15 11:00:00', 
            'ubicacion' => 'Instalaciones del centro colaborador',
            'imagen_url' => $imagenAleatoria,
        ];
    }
}