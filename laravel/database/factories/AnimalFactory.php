<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        // Pools de datos fijos para evitar llamadas a objetos externos
        $nombres = ['Thor', 'Luna', 'Kira', 'Coco', 'Simba', 'Max', 'Bimba', 'Lola', 'Rocky', 'Toby', 'Nala', 'Pepe', 'Bruno', 'Mia'];
        $razas = ['Golden Retriever', 'Comun Europeo', 'Pastor Aleman', 'Persa', 'Border Collie', 'Siames', 'Mestizo', 'Chihuahua'];

        return [
            // Seleccionamos un elemento aleatorio de forma nativa con PHP puro
            'nombre' => $nombres[array_rand($nombres)],
            'raza' => $razas[array_rand($razas)],
            'estado' => 'En adopción',
            'descripcion' => 'Un peludito maravilloso en busca de una familia que le de mucho amor y estabilidad.',
            'imagen_url' => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop',
        ];
    }
}