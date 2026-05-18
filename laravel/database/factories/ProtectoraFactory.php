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
            'name' => $this->faker->company() . ' Protectora',
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('12345678'),
            'rol' => 'protectora',
            'validated' => true,
            'cif' => $this->faker->bothify('#???????#'),
            'direccion' => $this->faker->address(),
            'telefono' => $this->faker->numerify('6########'),
            'logo_url' => $this->faker->randomElement([
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
                null
            ]),
        ];
    }
}