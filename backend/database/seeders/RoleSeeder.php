<?php
namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'         => 'admin',
                'display_name' => 'Administrator',
                'permissions'  => ['*'],  // ทุก permission
            ],
            [
                'name'         => 'manager',
                'display_name' => 'Manager',
                'permissions'  => [
                    'asset.view','asset.create','asset.edit',
                    'workflow.view','workflow.approve','workflow.reject',
                    'user.view','dashboard.view',
                ],
            ],
            [
                'name'         => 'employee',
                'display_name' => 'Employee',
                'permissions'  => [
                    'asset.view',
                    'workflow.view','workflow.create',
                    'dashboard.view',
                ],
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['name' => $role['name']], $role);
        }


        // สร้าง admin user ตัวแรก
        User::updateOrCreate(
            ['email' => 'admin@enterprise.local'],
            [
                'name'     => 'System Admin',
                'password' => Hash::make('Admin@1234'),
                'role_id'  => Role::where('name','admin')->value('id'),
            ]
        );
    }
}
