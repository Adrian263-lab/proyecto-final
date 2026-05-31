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

        // CORREGIDO: Pool de imágenes 100% enfocado en eventos con animales, refugios y voluntariado
        $imagenes = [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop', // Perros corriendo (Feria/Paseo)
            'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&auto=format&fit=crop', // Voluntario con perro
            'https://images.unsplash.com/photo-1601758124540-52d66063067a?w=800&auto=format&fit=crop', // Cachorro jugando en evento
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop', // Donaciones y mantas
            'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&auto=format&fit=crop', // Perros socializando
        ];

        return [
            'user_id' => User::factory(), 
            'titulo' => $titulos[array_rand($titulos)],
            'descripcion' => 'Descripción autogenerada del evento para las actividades de nuestra protectora y el bienestar de los peluditos.',
            'fecha' => now()->addDays(rand(1, 45))->setTime(rand(9, 20), 0, 0),
            'ubicacion' => $ubicaciones[array_rand($ubicaciones)],
            'imagen_url' => $imagenes[array_rand($imagenes)],
        ];
    }
}