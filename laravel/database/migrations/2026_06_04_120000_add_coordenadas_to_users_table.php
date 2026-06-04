<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Se añaden los campos para geolocalización de las protectoras
            $table->decimal('latitud', 10, 8)->nullable()->after('direccion');
            $table->decimal('longitud', 11, 8)->nullable()->after('latitud');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['latitud', 'longitud']);
        });
    }
};