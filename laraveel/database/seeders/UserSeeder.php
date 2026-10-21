<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Reda Owner',    'email' => 'reda@owner',    'role' => 'owner'],
            ['name' => 'Reda Manager',  'email' => 'reda@manager',  'role' => 'manager'],
            ['name' => 'Reda Waiter',   'email' => 'reda@waiter',   'role' => 'waiter'],
            ['name' => 'Reda Chef',     'email' => 'reda@chef',     'role' => 'chef'],
            ['name' => 'Reda Cashier',  'email' => 'reda@cashier',  'role' => 'cashier'],
            ['name' => 'Reda Stock',    'email' => 'reda@stock',    'role' => 'stock'],
            ['name' => 'Reda Delivery', 'email' => 'reda@delivery', 'role' => 'delivery'],


             ['name' => 'Sihame Owner',    'email' => 'sihame@owner',    'role' => 'owner'],
            ['name' => 'Sihame Manager',  'email' => 'sihame@manager',  'role' => 'manager'],
            ['name' => 'Sihame Waiter',   'email' => 'sihame@waiter',   'role' => 'waiter'],
            ['name' => 'Sihame Chef',     'email' => 'sihame@chef',     'role' => 'chef'],
            ['name' => 'Sihame Cashier',  'email' => 'sihame@cashier',  'role' => 'cashier'],
            ['name' => 'Sihame Stock',    'email' => 'sihame@stock',    'role' => 'stock'],
            ['name' => 'Sihame Delivery', 'email' => 'sihame@delivery', 'role' => 'delivery'],



             ['name' => 'ISmail Owner',    'email' => 'ismail@owner',    'role' => 'owner'],
            ['name' => 'ISmail Manager',  'email' => 'ismail@manager',  'role' => 'manager'],
            ['name' => 'ISmail Waiter',   'email' => 'ismail@waiter',   'role' => 'waiter'],
            ['name' => 'ISmail Chef',     'email' => 'ismail@chef',     'role' => 'chef'],
            ['name' => 'ISmail Cashier',  'email' => 'ismail@cashier',  'role' => 'cashier'],
            ['name' => 'ISmail Stock',    'email' => 'ismail@stock',    'role' => 'stock'],
            ['name' => 'ISmail Delivery', 'email' => 'ismail@delivery', 'role' => 'delivery'],
            
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name'     => $u['name'],
                    'password' => Hash::make('1234'),
                    'role'     => $u['role'],
                ]
            );
        }
    }
}
