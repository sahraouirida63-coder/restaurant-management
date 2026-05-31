<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\Table;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('orderItems.menuItem', 'table', 'waiter')->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            // Accept either table_number (label on button) or table_id (DB PK)
            'table_number'         => 'nullable|integer|min:1',
            'table_id'             => 'nullable|integer|min:1',
            'items'                => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
        ]);

        // Resolve the actual table row — frontend sends the number label (1-20)
        if ($request->filled('table_number')) {
            $table = Table::where('number', $request->table_number)->first();
        } elseif ($request->filled('table_id')) {
            // Try by number first (frontend sends number as table_id), then by PK
            $table = Table::where('number', $request->table_id)->first()
                ?? Table::find($request->table_id);
        } else {
            return response()->json(['message' => 'A table must be selected.'], 422);
        }

        if (!$table) {
            return response()->json([
                'message' => 'The selected table does not exist.',
                'errors'  => ['table_id' => ['No table found with that number. Please re-seed the tables.']],
            ], 422);
        }

        // Always derive waiter_id from the authenticated user — never trust the client.
        $waiterId = $request->user()->id;

        $total = 0;
        foreach ($request->items as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_item_id']);
            $total += $menuItem->price * $item['quantity'];
        }

        $order = Order::create([
            'table_id'    => $table->id,   // always use the resolved DB primary key
            'waiter_id'   => $waiterId,
            'status'      => 'pending',
            'total_price' => $total,
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id'     => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity'     => $item['quantity'],
            ]);
        }

        return response()->json($order->load('orderItems.menuItem', 'table', 'waiter'), 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $request->validate([
            'status' => 'required|string',
        ]);

        $order->update($request->only('status'));
        return response()->json($order);
    }
}
