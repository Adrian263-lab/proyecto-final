<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class ProtectoraFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Protectora',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('12345678'), // Contraseña genérica para pruebas
            'rol' => 'protectora',
            'validado' => true, // Imprescindible para que pase tu filtro de React
            'cif' => fake()->bothify('#???????#'), // Genera un formato tipo CIF ficticio
            'direccion' => fake()->address(),
            'telefono' => fake()->numerify('6########'),
            'logo_url' => fake()->randomElement([
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', // Imagen de animales genérica
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
                null // Fallback para probar el emoji de edificio 🏢
            ]),
        ];
    }
}