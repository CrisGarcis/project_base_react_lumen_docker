<?php

namespace App\Http\Middleware;

use Closure;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $permission)
    {
        
        if(!$request->user()->is_admin){
            if (!$request->user()->canIdo($permission)) {
                return response('Forbidden.', 403);
            }
        }
        

        return $next($request);
    }
}
