/// <reference path="../types/jquery.d.ts" />

module trains.logo {

    export function InitialiseLogo($container: JQuery):void {

        var outClass = 'fadeOutLeft';
        var inClass = 'fadeInRight';

        var $asciiLogo: JQuery = $container.find('.ui-ascii-logo');
        $asciiLogo.addClass('animated');

        $asciiLogo.on('mouseover', () => {
            if (!$asciiLogo.hasClass(outClass) && !$asciiLogo.hasClass(inClass)) {
                $asciiLogo.addClass(outClass);
            }
        });

        $asciiLogo.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            if ($asciiLogo.hasClass(outClass)) {
                $asciiLogo.removeClass(outClass).addClass(inClass);
            }
            else if ($asciiLogo.hasClass(inClass)) {
                $asciiLogo.removeClass(inClass);
            }
        });
    }
}