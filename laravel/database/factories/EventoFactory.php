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
        // Buscamos una protectora. 
        // Usamos 'first()' después de 'inRandomOrder()'
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
            'https://images.unsplash.com/photo-1544568100-847a948585b9',
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
            'https://images.unsplash.com/photo-1537151608828-ea2b117b6b86',
        ];

        return [
            // AÑADIDO: Si no hay protectora, creamos un usuario temporal o lanzamos un error claro
            'user_id' => $protectora ? $protectora->id : User::factory()->create(['rol' => 'protectora'])->id,
            'titulo' => $titulos[array_rand($titulos)],
            'descripcion' => 'Descripción autogenerada del evento para las actividades de nuestra protectora.',
            'fecha' => now()->addDays(rand(1, 45))->setTime(rand(9, 20), 0, 0),
            'ubicacion' => $ubicaciones[array_rand($ubicaciones)],
            'imagen_url' => $imagenes[array_rand($imagenes)],
        ];
    }
}