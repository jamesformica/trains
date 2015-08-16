/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {



    export function InitialisePlay($container: JQuery):void {


        var $trainCanvas = $container.find('.ui-train-canvas');
        var $gridCanvas = $container.find('.ui-grid-canvas');

        new trains.play.Board($trainCanvas, $gridCanvas);

    }


}