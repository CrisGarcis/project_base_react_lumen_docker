<?php

namespace App\Http\Middleware;

use Closure;

class CheckAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        if (!$request->user()->is_admin) {

            return response('Forbidden.', 403);
        }
        return $next($request);
    }
}
