<?php

namespace Database\Factories;

use App\Models\Evento;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

class EventoFactory extends Factory
{
    protected $model = Evento::class;

    public function definition(): array
    {
        $faker = \Faker\Factory::create();
        $fotosEventos = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'
        ];

        return [
            'titulo' => 'Evento Solidario ' . $faker->word(),
            'descripcion' => $faker->realText(100),
            'fecha' => $faker->dateTimeBetween('2026-06-01', '2026-06-30')->format('Y-m-d H:i:s'),
            'ubicacion' => $faker->address(),
            'imagen_url' => $faker->randomElement($fotosEventos),
        ];
    }
}