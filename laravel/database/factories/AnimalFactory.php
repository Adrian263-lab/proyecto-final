<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        $nombres = ['Thor', 'Luna', 'Kira', 'Coco', 'Simba', 'Max', 'Bimba', 'Lola', 'Rocky', 'Toby', 'Nala', 'Pepe'];
        $razas = ['Golden Retriever', 'Común Europeo', 'Pastor Alemán', 'Persa', 'Border Collie', 'Siamés', 'Mestizo'];
        $sexos = ['Macho', 'Hembra'];

        return [
            'nombre' => $this->faker->randomElement($nombres),
            'raza' => $this->faker->randomElement($razas),
            'sexo' => $this->faker->randomElement($sexos),
            'estado' => 'En adopción',
            'descripcion' => 'Un peludito maravilloso en busca de una familia que le dé mucho amor y estabilidad.',
            'imagen_url' => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop',
            // Los campos 'user_id' y 'especie_id' no los ponemos aquí porque se los inyectamos 
            // de forma dinámica desde el bucle de tu DatabaseSeeder.php
        ];
    }
}