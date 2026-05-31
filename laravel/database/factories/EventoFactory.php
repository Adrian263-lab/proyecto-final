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

        // POOL CORREGIDO Y VERIFICADO: Solo imágenes puras de animales y refugios
        $imagenes = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop', // Dos perros corriendo felices por el césped
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop', // Gato tierno mirando de frente
            'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop', // Perro golden retriever jugando al aire libre
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop', // Perro divertido con gafas
            'https://images.unsplash.com/photo-1537151608828-ea2b117b6b86?w=800&auto=format&fit=crop', // Cachorro pequeño tumbado en el parque
            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop', // Perro de protectora esperando feliz
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop'  // Grupo de cachorritos durmiendo juntos
        ];

        return [
            'user_id' => User::factory(), 
            'titulo' => $titulos[array_rand($titulos)],
            'descripcion' => 'Descripción autogenerada del evento para las actividades de nuestra protectora y el bienestar de los peluditos.',
            'fecha' => now()->addDays(rand(1, 45))->setTime(rand(9, 20), 0, 0),
            'ubicacion' => $ubicaciones[array_rand($ubicaciones)],
            'imagen_url' => $imagenes[array_rand($imagenes)], // Elige siempre una foto del catálogo de animales
        ];
    }
}