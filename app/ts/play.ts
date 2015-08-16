/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {

    export function InitialisePlay($container:JQuery):void {

        var $trainCanvas = $container.find('.ui-train-canvas');
        var $gridCanvas = $container.find('.ui-grid-canvas');

        var $pencil = $container.find('.ui-pencil');
        var $eraser = $container.find('.ui-eraser');

        var board = new trains.play.Board($trainCanvas, $gridCanvas);

        $pencil.click(() => {
            board.setTool(trains.play.Tool.Track);
        });

        $eraser.click(() => {
            board.setTool(trains.play.Tool.Eraser);
        });
    }
}