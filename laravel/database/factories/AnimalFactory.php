<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        // Instanciamos Faker aquí directamente, sin depender de la clase padre
        $faker = \Faker\Factory::create();

        return [
            'nombre' => $faker->firstName(), // Ahora sí funcionará
            'raza' => $faker->randomElement(['Golden Retriever', 'Pastor Alemán', 'Común Europeo', 'Siames']),
            'estado' => $faker->randomElement(['En adopción', 'En acogida']),
            'descripcion' => $faker->sentence(),
            'imagen_url' => 'https://images.unsplash.com/photo-1552053831-71594a27632d',
        ];
    }
}