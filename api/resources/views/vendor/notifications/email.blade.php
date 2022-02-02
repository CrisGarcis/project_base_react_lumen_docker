
@component('mail::message')
{{-- <img src="{{url('/images/ICONO-ZEUS.png')}}" style="height: 100px;"/> --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level === 'error')
# @lang('Whoops!')
@else
# @lang('Hello!')
@endif
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    switch ($level) {
        case 'success':
        case 'error':
            $color = $level;
            break;
        default:
            $color = 'green';
    }
?>
<a style="display:table;margin:0 auto;padding:12px;cursor: pointer;color:white;box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);background: #f88d34;border-radius: 4px;text-decoration: none;" href="{{$actionUrl}}">
{{ $actionText }}
</a>
{{-- @component('mail::button', ['url' => $actionUrl, 'color' => $color])
{{ $actionText }}


@endcomponent --}}
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
@lang('Regards'),<br>
{{ config('app.name') }}
@endif

{{-- Subcopy --}}
@isset($actionText)
@slot('subcopy')
@lang(
    "If you’re having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser: [:actionURL](:actionURL)',
    [
        'actionText' => $actionText,
        'actionURL' => $actionUrl,
    ]
)
@endslot
@endisset
@endcomponent
