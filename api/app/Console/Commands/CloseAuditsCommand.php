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
use App\Models\PlantAudit;
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
class CloseAuditsCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = "close:audits";

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Cierra auditorias vencidas";
    protected $STATUS_FINISH = 8;
    protected $STATUS_REJECTED = 9;


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $now = Carbon::now();
            $plants = CompanyPlant::all();
            foreach ($plants as $plant) {

                if ($plant->hours_close_audit) {
                    $audits = $plant->audits()->whereNotIn('status_id', [$this->STATUS_FINISH])->get();
                    foreach ($audits as $audit) {
                        $hours=$now->diffInHours(Carbon::parse($audit->created_at));
                       if($hours>$audit->hours_close_audit){
                           $audit->status_id=$this->STATUS_REJECTED;
                           $audit->update();
                       }
                    }
                   
                }
            }
        } catch (\Throwable $th) {
            Log::error($th);
        }
    }
}
