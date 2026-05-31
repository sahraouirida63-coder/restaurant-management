<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    private function resolveImageUrl(?string $image): ?string
    {
        if (!$image) return null;
        return str_starts_with($image, 'http') ? $image : asset('storage/' . $image);
    }

    public function index()
    {
        $employees = Employee::all()->map(function ($emp) {
            $emp->profile_image_url = $this->resolveImageUrl($emp->profile_image);
            return $emp;
        });
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|string',
        ]);

        // Create User account (for login)
        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        // Create Employee record
        $employee = Employee::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'password'      => $request->password, // model boot will hash it
            'role'          => $request->role,
            'phone'         => $request->phone,
            'profile_image' => $request->profile_image,
        ]);

        $employee->profile_image_url = $this->resolveImageUrl($employee->profile_image);
        return response()->json($employee, 201);
    }

    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);
        $data = $request->only(['name', 'email', 'role', 'phone', 'profile_image']);
        $employee->update($data);
        $employee->profile_image_url = $this->resolveImageUrl($employee->profile_image);
        return response()->json($employee);
    }

    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        User::where('email', $employee->email)->delete();
        $employee->delete();
        return response()->json(['message' => 'Employee and User account deleted']);
    }
}