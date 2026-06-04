<?php

namespace Database\Factories;

use App\Models\Evento;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventoFactory extends Factory
{
    protected $model = Evento::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(3),
            'descripcion' => $this->faker->paragraph(),
            'fecha' => $this->faker->dateTimeBetween('now', '+1 month'),
            'ubicacion' => $this->faker->city(),
            'imagen_url' => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
        ];
    }
}