<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OwnershipMiddleware
{
    public function handle(Request $request, Closure $next, string $modelClass, string $ownerField = 'user_id'): Response
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $id = $request->route()->parameter('id');
        if (!$id) {
            return response()->json(['error' => 'Resource ID required'], 400);
        }

        $model = $modelClass::find($id);
        if (!$model) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        if ($model->$ownerField != $user->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}