<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('12345678'),
            'rol' => 'particular',
            'validado' => true,
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    public function protectora(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'protectora',
            'cif' => $this->faker->unique()->bothify('G########'),
            'direccion' => $this->faker->address(),
            'latitud' => $this->faker->latitude(36.0, 43.8),
            'longitud' => $this->faker->longitude(-9.0, 3.3),
            'logo_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
        ]);
    }
}
