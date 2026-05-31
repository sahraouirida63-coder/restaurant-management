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
