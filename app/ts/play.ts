/// <reference path="../types/jquery.d.ts" />

module trains.play {

    var gridSize = 30;

    export function InitialisePlay($container: JQuery):void {

        var $window = $(window);

        var $canvas = $container.find('.ui-trains-canvas');
        var canvas = <HTMLCanvasElement>$canvas.get(0);
        var context = canvas.getContext("2d");

        var canvasWidth = trains.play.RoundToNearestGridSize($window.width() - (gridSize * 2));
        var canvasHeight = trains.play.RoundToNearestGridSize($window.height() - (gridSize * 2));

        $canvas.attr('width', canvasWidth);
        $canvas.attr('height', canvasHeight);
        $canvas.width(canvasWidth);
        $canvas.css('margin-top', ($window.height() - canvasHeight) / 2);

        context.beginPath();

        for (var x = gridSize; x < canvasWidth ; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }

        for (var y = gridSize; y < canvasHeight; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }

        context.strokeStyle = "#ddd";
        context.stroke();
        context.closePath();

        canvas.addEventListener('click', (event: MouseEvent) => {

            var x = trains.play.FloorToNearestGridSize(event.pageX - canvas.offsetLeft);
            var y = trains.play.FloorToNearestGridSize(event.pageY - canvas.offsetTop);

            context.rect(x, y, gridSize, gridSize);
            context.fillStyle = "red";
            context.fill();
        });

    }

    export function RoundToNearestGridSize(value: number) {
        return Math.round(value / gridSize) * gridSize;
    }

    export function FloorToNearestGridSize(value: number) {
        return Math.floor(value / gridSize) * gridSize;
    }
}