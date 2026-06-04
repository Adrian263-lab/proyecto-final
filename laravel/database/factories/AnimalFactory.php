<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->firstName(),
            'raza' => $this->faker->randomElement(['Golden Retriever', 'Pastor Alemán', 'Común Europeo', 'Siames']),
            'estado' => $this->faker->randomElement(['En adopción', 'En acogida']),
            'descripcion' => $this->faker->sentence(),
            'imagen_url' => 'https://images.unsplash.com/photo-1552053831-71594a27632d',
        ];
    }
}