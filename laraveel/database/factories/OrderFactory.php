<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'table_id' => \App\Models\Table::factory(),
            'waiter_id' => \App\Models\User::where('role', 'waiter')->inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
            'total_price' => fake()->randomFloat(2, 15, 150),
        ];
    }
}