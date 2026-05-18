<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ProtectoraSeeder extends Seeder
{
    public function run(): void
    {
        // Genera 5 usuarios con los datos aleatorios de protectora
        User::factory()->count(5)->create();
    }
}