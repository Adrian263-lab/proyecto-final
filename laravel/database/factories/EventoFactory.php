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
        // Buscamos un usuario que tenga el rol de protectora para asociarle el evento
        $protectora = User::where('rol', 'protectora')->inRandomOrder()->first();

        return [
            // Si no hay protectoras creadas todavía, creará una nueva automáticamente
            'user_id' => $protectora ? $protectora->id : User::factory()->create(['rol' => 'protectora', 'validado' => true])->id,
            'titulo' => $this->faker->randomElement([
                'Feria de Adopción Responsable',
                'Mercadillo Solidario Navideño',
                'Paseo de Perros Comunitario',
                'Taller de Educación Canina',
                'Colecta de Alimentos y Mantas'
            ]),
            'descripcion' => $this->faker->paragraph(3),
            // Genera una fecha aleatoria entre mañana y los próximos 2 meses
            'fecha' => $this->faker->dateTimeBetween('+1 day', '+2 months'),
            'ubicacion' => $this->faker->randomElement([
                'Parque Central, Sector Norte',
                'Plaza Mayor',
                'Centro Cívico Municipal',
                'Instalaciones de la Protectora'
            ]),
            'imagen_url' => $this->faker->randomElement([
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', // Foto de perros bonita
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', // Foto de gatos bonita
                null // A veces dejamos la imagen vacía para probar el fallback de tu React
            ]),
        ];
    }
}