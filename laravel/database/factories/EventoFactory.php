<?php

namespace Database\Factories;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventoFactory extends Factory
{
    protected $model = Evento::class;

    public function definition(): array
    {
        $faker = app(\Faker\Generator::class);
        
        // Busca una protectora de la base de datos para asignarle el evento
        $protectora = User::where('rol', 'protectora')->inRandomOrder()->first();

        return [
            'user_id' => $protectora ? $protectora->id : 2, 
            'titulo' => $faker->randomElement([
                'Feria de Adopción Responsable',
                'Mercadillo Solidario Navideño',
                'Paseo de Perros Comunitario',
                'Taller de Educación Canina',
                'Colecta de Alimentos y Mantas'
            ]),
            'descripcion' => $faker->paragraph(3),
            'fecha' => $faker->dateTimeBetween('+1 day', '+2 months'),
            'ubicacion' => $faker->randomElement([
                'Parque Central, Sector Norte',
                'Plaza Mayor',
                'Centro Cívico Municipal',
                'Instalaciones de la Protectora'
            ]),
            'imagen_url' => $faker->randomElement([
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
                null
            ]),
        ];
    }
}