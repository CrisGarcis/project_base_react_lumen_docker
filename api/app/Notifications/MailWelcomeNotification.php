<?php
namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class MailWelcomeNotification extends ResetPassword
{
    protected $user;
    protected $tokenActive;
    protected $TOKEN_TYPE_ACTIVE_ACCOUNT_INVITED = "active_account_invited";
    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->tokenActive = $token;
    }
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
            ->subject('Bienvenido')
            ->greeting('Hola ' . $this->user->first_name)
            ->line('¡Te damos la bienvenida a ' . config('app.name') . "!")
            ->line("¡Gracias por crear una cuenta! Cuando verifiques tu correo eléctronico podrás ingresar a disfrutar todo su contenido")
            ->action('Activa tu cuenta',($this->tokenActive->type==$this->TOKEN_TYPE_ACTIVE_ACCOUNT_INVITED)?env('APP_GUI_URL')."/activeAccountInvited/". $this->tokenActive->token:env('APP_GUI_URL')."/activeAccount/". $this->tokenActive->token)
            ->salutation('Saludos, ' . config('app.name'));
    }
}
