<?php

/**
 *
 * PHP version >= 7.0
 *
 * @category Console_Command
 * @package  App\Console\Commands
 */

namespace App\Console\Commands;

use App\Models\CompanyPlant;
use App\Models\ConfigPlant;
use App\Models\LevelStationStaff;
use Carbon\Carbon;
use App\Models\Mailer;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Log as FacadesLog;
use Symfony\Component\HttpKernel\Log\Logger as LogLogger;

/**
 * Class SendEmailCommand
 *
 * @category Console_Command
 * @package  App\Console\Commands
 */
class SendEmailRecertifyEmployeCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = "recertify:notification";

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Envia correo de prueba";


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {

            $plants = CompanyPlant::all();
            foreach ($plants as $plant) {
                $config = ConfigPlant::select('json->numberStation->recertificationMonth as config')
                    ->where('code', 'numberStation')
                    ->where('company_plant_id', $plant->id)->first();
                $months = $config['config'];


                $now = Carbon::now();
                $now->modify('-' . $months . ' months');


                $stations = LevelStationStaff::select('level_station_staff.level_id', 'level_station_staff.staff_id', 'level_station_staff.configuration_station_id','level_station_staff.elearning_date')
                    ->join('staff', 'level_station_staff.staff_id', '=', 'staff.id')
                    ->whereIn('level_id',[3,4])
                    ->where('staff.company_plant_id', $plant->id)->where('level_station_staff.elearning_date', '<', $now)
                    ->groupBy('level_station_staff.staff_id', 'level_station_staff.configuration_station_id', 'level_station_staff.level_id', 'level_station_staff.elearning_date')->get();
               

                $data = [
                    'subject' => "Email prueba",
                    'path_view' => "email.recertifyEmploye",
                    'stations' => $stations
                ];
                if (sizeof($stations) > 0) {
                    Mail::to("desarrollo.crhonosiso@gmail.com")->send(new Mailer($data));
                }
            }
        } catch (\Throwable $th) {
            Log::error($th);
        }
    }
}
