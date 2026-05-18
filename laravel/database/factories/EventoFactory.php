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
        $protectora = User::where('rol', 'protectora')->inRandomOrder()->first();

        $titulos = [
            'Feria de Adopción Responsable',
            'Mercadillo Solidario Navideño',
            'Paseo de Perros Comunitario',
            'Taller de Educación Canina',
            'Colecta de Alimentos y Mantas'
        ];

        $ubicaciones = [
            'Parque Central, Sector Norte',
            'Plaza Mayor',
            'Centro Cívico Municipal',
            'Instalaciones de la Protectora'
        ];

        $imagenes = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
            null
        ];

        return [
            'user_id' => $protectora ? $protectora->id : 2, 
            'titulo' => $titulos[array_rand($titulos)],
            'descripcion' => 'Descripción autogenerada del evento para pruebas del sistema en el entorno de desarrollo y producción.',
            'fecha' => now()->addDays(rand(1, 45))->setTime(rand(9, 20), 0, 0),
            'ubicacion' => $ubicaciones[array_rand($ubicaciones)],
            'imagen_url' => $imagenes[array_rand($imagenes)],
        ];
    }
}