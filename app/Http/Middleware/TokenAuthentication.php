<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;

class TokenAuthentication
{
    public function handle($request, Closure $next)
    {
        if (Session::has('usuario')) {
            return $next($request);
        }
        return redirect()->route('login');
    }
}