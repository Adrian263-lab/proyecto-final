<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('animals', function (Blueprint $table) {
            if (!Schema::hasColumn('animals', 'sexo')) {
                $table->string('sexo')->after('nombre')->default('Macho');
            }
            if (!Schema::hasColumn('animals', 'raza')) {
                $table->string('raza')->after('sexo')->nullable();
            }
            if (!Schema::hasColumn('animals', 'descripcion')) {
                $table->text('descripcion')->after('raza')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Y aquí también
        Schema::table('animals', function (Blueprint $table) {
            $table->dropColumn(['sexo', 'raza', 'descripcion']);
        });
    }
};
