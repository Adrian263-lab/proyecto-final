<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ProtectoraSeeder extends Seeder
{
    public function run(): void
    {
        // Crea 5 usuarios aleatorios aplicando el estado de protectora
        User::factory()->count(5)->protectora()->create();
    }
}