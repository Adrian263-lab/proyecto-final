<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class EventoFactory extends Factory
{
    public function definition(): array
    {
        $fotosEventos = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'
        ];

        return [
            'titulo' => 'Evento Solidario ' . fake()->word(),
            'descripcion' => fake()->realText(100),
            'fecha' => fake()->dateTimeBetween('2026-06-01', '2026-06-30')->format('Y-m-d H:i:s'),
            'ubicacion' => fake()->address(),
            'imagen_url' => fake()->randomElement($fotosEventos),
        ];
    }
}