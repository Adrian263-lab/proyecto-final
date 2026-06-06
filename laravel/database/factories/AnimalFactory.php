<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        $faker = \Faker\Factory::create();
        $fotosAnimales = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d', 
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
        ];

        return [
            'nombre' => $faker->firstName(),
            'raza' => $faker->randomElement(['Común', 'Mestizo', 'Galgo', 'Podenco']),
            'estado' => $faker->randomElement(['En adopción', 'Adoptado', 'Urgente']),
            'descripcion' => $faker->realText(150),
            'sexo' => $faker->randomElement(['Macho', 'Hembra']),
            'imagen_url' => $faker->randomElement($fotosAnimales),
        ];
    }
}