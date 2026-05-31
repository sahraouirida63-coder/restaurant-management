<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::with('ingredient')->get();
        $alerts = $stocks->filter(function ($stock) {
            return $stock->quantity < 10; // Example threshold
        });
        return response()->json([
            'stocks' => $stocks,
            'alerts' => $alerts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric',
        ]);

        $stock = Stock::create($request->all());
        return response()->json($stock, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $stock = Stock::findOrFail($id);
        $request->validate([
            'quantity' => 'numeric',
        ]);

        $stock->update($request->all());
        return response()->json($stock);
    }
}
