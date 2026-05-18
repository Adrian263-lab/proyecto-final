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
        // Buscamos un usuario con rol de protectora
        $protectora = User::where('rol', 'protectora')->inRandomOrder()->first();

        return [
            // Si por alguna razón no existiera, creamos un ID genérico válido
            'user_id' => $protectora ? $protectora->id : 2, 
            'titulo' => fake()->randomElement([
                'Feria de Adopción Responsable',
                'Mercadillo Solidario Navideño',
                'Paseo de Perros Comunitario',
                'Taller de Educación Canina',
                'Colecta de Alimentos y Mantas'
            ]),
            'descripcion' => fake()->paragraph(3),
            'fecha' => fake()->dateTimeBetween('+1 day', '+2 months'),
            'ubicacion' => fake()->randomElement([
                'Parque Central, Sector Norte',
                'Plaza Mayor',
                'Centro Cívico Municipal',
                'Instalaciones de la Protectora'
            ]),
            'imagen_url' => fake()->randomElement([
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
                null
            ]),
        ];
    }
}