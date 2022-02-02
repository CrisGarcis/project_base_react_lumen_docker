<?php

use App\Models\Document;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Imports\StationsImport;
use Illuminate\Support\Facades\Auth;

$router->get("documents/{hash}", function ($hash) {

    $document = Document::where("name", $hash)->first();

    if ($document) {
        /*   chmod($document->real_path, 777);
        return fopen($document->real_path,'a+');
        if ( $xlsx = SimpleXLSX::parse($document->real_path) ) {
            print_r( $xlsx->rows() );
        } else {
            echo SimpleXLSX::parseError();
        }
         

        return Excel::toArray(new StationsImport,$document->real_path);  */
        return file_get_contents($document->real_path);
    }
});
