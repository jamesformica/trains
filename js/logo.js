/// <reference path="../types/jquery.d.ts" />
var trains;
(function (trains) {
    var logo;
    (function (logo) {
        function InitialiseLogo($container) {
            var outClass = 'fadeOutLeft';
            var inClass = 'fadeInRight';
            var $asciiLogo = $container.find('.ui-ascii-logo');
            $asciiLogo.addClass('animated');
            $asciiLogo.on('mouseover', function () {
                if (!$asciiLogo.hasClass(outClass) && !$asciiLogo.hasClass(inClass)) {
                    $asciiLogo.addClass(outClass);
                }
            });
            $asciiLogo.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                if ($asciiLogo.hasClass(outClass)) {
                    $asciiLogo.removeClass(outClass).addClass(inClass);
                }
                else if ($asciiLogo.hasClass(inClass)) {
                    $asciiLogo.removeClass(inClass);
                }
            });
        }
        logo.InitialiseLogo = InitialiseLogo;
    })(logo = trains.logo || (trains.logo = {}));
})(trains || (trains = {}));
