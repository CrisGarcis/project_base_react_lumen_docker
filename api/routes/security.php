<?php
// Route Group Security
$router->group([
    "prefix" => "security",
    "namespace" => "Security",
], function () use ($router) {
    resource("person", "Person", $router);
    resource("user", "User", $router);
    resource("user_plant", "UserPlant", $router);

    resource("role", "Role", $router);
    resource("permission", "Permission", $router);
    resource("session", "Session", $router);
    $router->post("login", "AuthController@login");
    $router->get("getuser", "AuthController@user");
    $router->get("getPermissions", "UserController@getPermissions");


    
    $router->post('password/email', 'PasswordController@postEmail');
     //Añade roles a una persona
     $router->post("personAttachProfile/{person_id}", [
        "as" => "personAttachProfile", "uses" => "ActionsController@personAttachProfile",
    ]);
   
    //Remueve un rol de una persona en una planta
    $router->post("personDetachProfile", [
        "as" => "personDetachProfile", "uses" => "ActionsController@personDetachProfile",
    ]);
    //Añade  permisos a un rol
    $router->post("profileAttachPermission/{profile_id}", [
        "as" => "profileAttachPermission", "uses" => "ActionsController@profileAttachPermission",
    ]);

    //Remueve un permiso de un rol
    $router->post("permissionDetachProfile", [
        "as" => "permissionDetachProfile", "uses" => "ActionsController@permissionDetachProfile",
    ]);
});
