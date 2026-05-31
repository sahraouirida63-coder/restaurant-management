<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    /**
     * Seed 10 high-quality menu items with realistic data and Unsplash images.
     */
    public function run(): void
    {
        // Disable FK checks so truncate works even with order_items references
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        MenuItem::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $items = [
            [
                'name'        => 'Margherita Pizza',
                'description' => 'Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala and hand-torn basil on a blistered wood-fired crust.',
                'price'       => 12.99,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'BBQ Bacon Burger',
                'description' => 'Juicy 200 g beef patty, smoky BBQ sauce, crispy streaky bacon, melted cheddar, caramelised onions and house pickles in a toasted brioche bun.',
                'price'       => 14.99,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Spaghetti Carbonara',
                'description' => 'Traditional Roman pasta: al-dente spaghetti, crispy pancetta, egg-yolk cream, aged Pecorino Romano and plenty of cracked black pepper.',
                'price'       => 13.99,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Grilled Atlantic Salmon',
                'description' => 'Pan-seared salmon fillet served with lemon-herb butter sauce, chargrilled asparagus and silky saffron mash.',
                'price'       => 22.99,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Pepperoni Pizza',
                'description' => 'Double-layer of stretchy mozzarella and premium cup-and-char pepperoni slices on our slow-fermented tomato base.',
                'price'       => 14.50,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Caesar Salad',
                'description' => 'Crisp romaine hearts, house-made Caesar dressing, shaved Parmesan, garlic sourdough croutons and optional white anchovy fillets.',
                'price'       => 8.99,
                'category'    => 'appetizer',
                'image'       => 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Chicken Fettuccine Alfredo',
                'description' => 'Silky fettuccine in a rich Parmigiano cream sauce with grilled chicken breast, roasted garlic and fresh flat-leaf parsley.',
                'price'       => 15.99,
                'category'    => 'main',
                'image'       => 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Chocolate Lava Cake',
                'description' => 'Warm 70 % dark-chocolate fondant with a flowing molten centre, served with Madagascan vanilla ice cream and raspberry coulis.',
                'price'       => 7.99,
                'category'    => 'dessert',
                'image'       => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Tiramisu',
                'description' => 'Classic Italian dessert: espresso-soaked savoiardi, whipped mascarpone and a generous dusting of fine Valrhona cocoa powder.',
                'price'       => 6.99,
                'category'    => 'dessert',
                'image'       => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=640&q=80&fit=crop',
            ],
            [
                'name'        => 'Mango Passion Smoothie',
                'description' => 'Blended Alphonso mango, passion-fruit pulp, coconut milk and a squeeze of fresh lime — poured over crushed ice.',
                'price'       => 5.49,
                'category'    => 'drink',
                'image'       => 'https://images.unsplash.com/photo-1546173159-315724a31696?w=640&q=80&fit=crop',
            ],
        ];

        foreach ($items as $item) {
            MenuItem::create($item);
        }

        $this->command->info('✅  10 menu items seeded successfully.');
    }
}