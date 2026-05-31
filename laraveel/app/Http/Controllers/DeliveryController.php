<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Delivery;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deliveries = Delivery::with('order')->get();
        return response()->json($deliveries);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $delivery = Delivery::findOrFail($id);
        $request->validate([
            'status' => 'required|string',
        ]);

        $delivery->update($request->only('status'));
        return response()->json($delivery);
    }
}
