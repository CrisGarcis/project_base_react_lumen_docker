<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});
function resource($prefix, $controller, $router)
{
    $router->group(["prefix" => $prefix], function ($router) use ($controller) {
        $router->get("/", $controller . "Controller@index");
        $router->post("/", $controller . "Controller@store");
        $router->get("/{id}", $controller . "Controller@show");
        $router->put("/{model_id}", $controller . "Controller@update");
        $router->post("/{model_id}", $controller . "Controller@update");
        $router->patch("/{model_id}", $controller . "Controller@update");
        $router->delete("/{model_id}", $controller . "Controller@delete");
    });
}
function documentable($prefix, $controller, $router)
{
    $router->group(["prefix" => $prefix], function ($router) use ($controller) {
        $router->post("{model_id}/documented", "$controller@addDocument");
        $router->get("{model_id}/documents", "$controller@documents");
        $router->post("{model_id}/deleteAndAddDocument", "$controller@deleteAndAddDocument");
        $router->delete("{model_id}/documentDelete/{document_id}", "$controller@documentDelete");
    });
}
function notifiable($prefix, $controller, $router)
{
    $router->group(["prefix" => $prefix], function ($router) use ($controller) {
        $router->get("{model_id}/notes", "$controller@notes");
        $router->post("{model_id}/notificated", "$controller@dataNotifiable");
        $router->delete("{model_id}/noteDelete/{note_id}", "$controller@noteDelete");
        $router->post("{model_id}/noteUpdate/{note_id}", "$controller@noteUpdate");
    });
}
function changeable($prefix, $controller, $router)
{
   
   
    $router->group(["prefix" => $prefix], function ($router) use ($controller) {
        $router->get("allStatus/{code}", "$controller@getStatus");
        $router->get("getJson/{code}", "$controller@getJson");

        $router->get("{model_id}/nextStatus", "$controller@nextStatus");
    });
}
// API route group

require __DIR__ . "/security.php";
require __DIR__ . "/document.php";



