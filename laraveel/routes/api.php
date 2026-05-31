<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\DeliveryController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'update']);
    Route::apiResource('employees', EmployeeController::class)->middleware('role:manager,owner');
    // Menu — read: any authenticated role | write: manager, owner, chef only
    Route::apiResource('menu', MenuController::class)->only(['index', 'show']);
    Route::apiResource('menu', MenuController::class)->only(['store', 'update', 'destroy'])->middleware('role:manager,owner,chef');
    Route::apiResource('stock', StockController::class)->only(['index', 'store', 'update'])->middleware('role:stock,manager,owner');
    Route::apiResource('deliveries', DeliveryController::class)->only(['index', 'update'])->middleware('role:delivery,manager,owner');
});