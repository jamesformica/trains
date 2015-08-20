/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {

    export function InitialisePlay($container: JQuery): void {

        var playComponents = GetPlayComponent($container);
        var board = new trains.play.Board(playComponents.$trainCanvas, playComponents.$gridCanvas);

        playComponents.$hintText.css("right", trains.play.gridSize);
        playComponents.$toolsButton.css("left", trains.play.gridSize / 2);

        playComponents.$toolsButton.click(() => {
            showToolsContainer();
        });

        playComponents.$canvases.mousedown(() => {
            closeToolsContainer();
        });

        playComponents.tools.$toolsContainer.mousedown(() => {
            closeToolsContainer();
        });

        playComponents.tools.$tools.click(() => {
            closeToolsContainer();
        });

        playComponents.tools.$tools.mouseover((event) => {
            var $target = $(event.currentTarget);
            playComponents.tools.$title.text($target.data("title"));
        });

        playComponents.tools.$pencil.click(() => {
            board.setTool(trains.play.Tool.Track);
        });

        playComponents.tools.$eraser.click(() => {
            board.setTool(trains.play.Tool.Eraser);
        });

        playComponents.tools.$rotate.click(() => {
            board.setTool(trains.play.Tool.Rotate);
        });

        var timer;
        $(window).keydown((event) => {
            if (event.ctrlKey && !event.shiftKey && event.keyCode === 17) {
                if (timer === undefined) {
                    timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = undefined;
                        showToolsContainer();
                    }, 300);
                }
            }
        });

        $(window).keyup(() => {
            clearTimeout(timer);
            timer = undefined;
        });

        function showToolsContainer(): void {
            playComponents.tools.$toolsContainer.fadeIn(400);
        }

        function closeToolsContainer(): void {
            playComponents.tools.$title.text("");
            playComponents.tools.$toolsContainer.fadeOut(400);
        }
    }

    export function GetPlayComponent($container: JQuery): trains.play.PlayComponents {

        var $trainCanvas = $container.find('.ui-train-canvas');
        var $gridCanvas = $container.find('.ui-grid-canvas');

        var $toolsContainer = $container.find('.ui-play-tools');
        var $pencil = $toolsContainer.find('.ui-pencil');
        var $eraser = $toolsContainer.find('.ui-eraser');
        var $rotate = $toolsContainer.find('.ui-rotate');

        return {
            $trainCanvas: $trainCanvas,
            $gridCanvas: $gridCanvas,
            $canvases: $().add($trainCanvas).add($gridCanvas),
            $hintText: $container.find('.ui-hint-text'),
            $toolsButton: $container.find('.ui-tools'),
            tools: {
                $toolsContainer: $toolsContainer,
                $title: $toolsContainer.find('.ui-tools-title'),
                $pencil: $pencil,
                $eraser: $eraser,
                $rotate: $rotate,
                $tools: $().add($pencil).add($eraser).add($rotate)
            }
        };
    }

    export interface PlayComponents {
        $trainCanvas: JQuery;
        $gridCanvas: JQuery;
        $canvases: JQuery;
        $hintText: JQuery;
        $toolsButton: JQuery;
        tools: trains.play.ToolsComponents;
    }

    export interface ToolsComponents {
        $toolsContainer: JQuery;
        $title: JQuery;
        $pencil: JQuery;
        $eraser: JQuery;
        $rotate: JQuery;
        $tools: JQuery;
    }


}