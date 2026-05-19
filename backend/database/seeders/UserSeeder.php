<?php
namespace Database\Seeders;

use App\Models\{User, Role};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminId    = Role::where('name','admin')->value('id');
        $managerId  = Role::where('name','manager')->value('id');
        $employeeId = Role::where('name','employee')->value('id');

        $users = [
            [
                'name'     => 'System Admin',
                'email'    => 'admin@enterprise.local',
                'password' => Hash::make('Admin@1234'),
                'role_id'  => $adminId,
            ],
            [
                'name'     => 'Sarah Manager',
                'email'    => 'manager@enterprise.local',
                'password' => Hash::make('Manager@1234'),
                'role_id'  => $managerId,
            ],
            [
                'name'     => 'John Employee',
                'email'    => 'employee@enterprise.local',
                'password' => Hash::make('Employee@1234'),
                'role_id'  => $employeeId,
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['email' => $u['email']], $u);
        }
    }
}
