<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ProtectoraSeeder extends Seeder
{
    public function run(): void
    {
        // Llama a la factory general de usuarios pero aplicándole tu estado de protectora
        User::factory()->count(5)->protectora()->create();
    }
}