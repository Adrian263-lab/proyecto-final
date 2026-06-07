<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        $faker = FakerFactory::create('es_ES');
        $fotosAnimales = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d', 
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
        ];

        return [
            'nombre' => $faker->firstName(),
            'raza' => $faker->randomElement(['Común', 'Mestizo', 'Galgo', 'Podenco']),
            'estado' => 'En adopción', // Por defecto, luego lo forzamos en el seeder
            'descripcion' => $faker->realText(150),
            'sexo' => $faker->randomElement(['Macho', 'Hembra']),
            'imagen_url' => $fotosAnimales[array_rand($fotosAnimales)],
        ];
    }
}