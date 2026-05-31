<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Delivery;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 orders
        for ($i = 0; $i < 50; $i++) {
            $waiter = User::where('role', 'waiter')->inRandomOrder()->first();
            $order = Order::factory()->create([
                'waiter_id' => $waiter ? $waiter->id : User::factory(),
            ]);

            // Add 1-5 random menu items to each order
            $menuItems = MenuItem::inRandomOrder()->take(rand(1, 5))->get();
            $totalPrice = 0;

            foreach ($menuItems as $menuItem) {
                $quantity = rand(1, 3);
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $quantity,
                ]);
                $totalPrice += $menuItem->price * $quantity;
            }

            // Update order total price
            $order->update(['total_price' => $totalPrice]);

            // Create payment for some orders
            if (rand(0, 1)) {
                Payment::create([
                    'order_id' => $order->id,
                    'amount' => $totalPrice,
                    'method' => fake()->randomElement(['cash', 'card', 'online']),
                ]);
            }

            // Create delivery for some orders
            if (rand(0, 1)) {
                Delivery::create([
                    'order_id' => $order->id,
                    'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'cancelled']),
                ]);
            }
        }
    }
}