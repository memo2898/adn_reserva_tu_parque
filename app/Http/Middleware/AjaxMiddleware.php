<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AjaxMiddleware
{
    public function handle($request, Closure $next)
    {
        if ($request->header('X-Requested-With') === 'XMLHttpRequest' || $request->wantsJson()) {
            return $next($request);
        }
        return response()->json(['error' => 'Acceso no autorizado'], 403);
    }
}
