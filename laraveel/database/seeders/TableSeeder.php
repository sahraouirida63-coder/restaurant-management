<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 tables
        for ($i = 1; $i <= 20; $i++) {
            Table::create([
                'number' => $i,
                'status' => fake()->randomElement(['available', 'occupied', 'reserved']),
            ]);
        }
    }
}