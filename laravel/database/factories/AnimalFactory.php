<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    public function definition(): array
    {
        $fotosAnimales = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d', 
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
        ];

        return [
            'nombre' => $this->faker->firstName(),
            'raza' => $this->faker->randomElement(['Común', 'Mestizo', 'Galgo', 'Podenco']),
            'estado' => $this->faker->randomElement(['En adopción', 'Adoptado', 'Urgente']),
            'descripcion' => $this->faker->realText(150),
            'sexo' => $this->faker->randomElement(['Macho', 'Hembra']),
            'imagen_url' => $this->faker->randomElement($fotosAnimales),
        ];
    }
}