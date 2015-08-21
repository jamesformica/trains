/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {

    export function InitialisePlay($container: JQuery): void {

        var playComponents = GetPlayComponent($container);
        var board = new trains.play.Board(playComponents.$trainCanvas, playComponents.$gridCanvas);

        playComponents.$hintText.css("right", trains.play.gridSize);
        playComponents.$toolsButton.css("top", (($(window).height() - board.canvasHeight) / 2) - (playComponents.$toolsButton.outerHeight() / 2));
        playComponents.$toolsButton.css("left", (($(window).width() - board.canvasWidth) / 2) - (playComponents.$toolsButton.outerWidth() / 2));

        playComponents.$toolsButton.click(() => {
            showToolsContainer();
        });

        playComponents.$canvases.mousedown(() => {
            closeToolsContainer();
        });

        playComponents.tools.$toolsContainer.mousedown(() => {
            closeToolsContainer();
        });

        playComponents.tools.$options.click(() => {
            closeToolsContainer();
        });

        playComponents.tools.$options.mouseover((event) => {
            var $target = $(event.currentTarget);
            playComponents.tools.$title.text($target.data("title"));
        });

        playComponents.tools.$options.click((event) => {
            var $option = $(event.currentTarget);
            switch ($option.data("action").toLowerCase()) {
                case "pencil": {
                    board.setTool(trains.play.Tool.Track);
                    break;
                }
                case "eraser": {
                    board.setTool(trains.play.Tool.Eraser);
                    break;
                }
                case "rotate": {
                    board.setTool(trains.play.Tool.Rotate);
                    break;
                }
                case "bomb": {
                    var response = confirm("Are you sure buddy?");
                    if (response) {
                        board.destroyTrack();
                    }
                    break;
                }
            }
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

        return {
            $trainCanvas: $trainCanvas,
            $gridCanvas: $gridCanvas,
            $canvases: $().add($trainCanvas).add($gridCanvas),
            $hintText: $container.find('.ui-hint-text'),
            $toolsButton: $container.find('.ui-tools'),
            tools: {
                $toolsContainer: $toolsContainer,
                $title: $toolsContainer.find('.ui-tools-title'),
                $options: $toolsContainer.find('.ui-tool-option')
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
        $options: JQuery;
    }
}