<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EmployeeSeeder::class,
            TableSeeder::class,
            MenuItemSeeder::class,
            IngredientSeeder::class,
            StockSeeder::class,
            RecipeSeeder::class,
            OrderSeeder::class,
            ReservationSeeder::class,
        ]);
    }
}
