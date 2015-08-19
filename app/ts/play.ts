/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {

    export function InitialisePlay($container:JQuery):void {

        var $trainCanvas = $container.find('.ui-train-canvas');
        var $gridCanvas = $container.find('.ui-grid-canvas');

        var board = new trains.play.Board($trainCanvas, $gridCanvas);

        var $toolsContainer = $container.find('.ui-play-tools');
        var $toolsTitle = $toolsContainer.find('.ui-tools-title');
        var $pencil = $toolsContainer.find('.ui-pencil');
        var $eraser = $toolsContainer.find('.ui-eraser');
        var $rotate = $toolsContainer.find('.ui-rotate');
        var $tools = $().add($pencil).add($eraser).add($rotate);

        $tools.on({
            mouseover: (event: JQueryEventObject) => {
                var $target = $(event.currentTarget);
                $toolsTitle.text($target.data("title"));
            }
        });


        $pencil.click(() => {
            board.setTool(trains.play.Tool.Track);
        });

        $eraser.click(() => {
            board.setTool(trains.play.Tool.Eraser);
        });

        $rotate.click(() => {
            board.setTool(trains.play.Tool.Rotate);
        });
        
        var timer;
        $(window).on({
            keydown: (event) => {
                if (event.ctrlKey && !event.shiftKey && event.keyCode === 17) {
                    if (timer === undefined) {
                        timer = setTimeout(() => {
                            clearTimeout(timer);
                            timer = undefined;
                            $toolsContainer.show();
                        }, 1000);
                    }
                }
            },
            keyup: () => {
                clearTimeout(timer);
                timer = undefined;
            }
        });


    }


}