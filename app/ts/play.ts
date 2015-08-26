/// <reference path="../types/jqueryui.d.ts" />
/// <reference path="play.board.ts" />

module trains.play {

    export function InitialisePlay($container: JQuery): void {
        var manager = new trains.play.PlayManager($container);
    }

    export class PlayManager {

        private playComponents: trains.play.PlayComponents;
        private board: trains.play.Board;

        constructor(private $container: JQuery) {
            this.playComponents = GetPlayComponent($container);
            this.board = new trains.play.Board(this.playComponents);

            var top = ($(window).height() - this.board.canvasHeight) / 2;
            var left = ($(window).width() - this.board.canvasWidth) / 2;
            this.playComponents.$trackButtons.css("top", top);
            this.playComponents.$trainButtons.css("top", top).css("right", left);
            
            this.playComponents.$trainButtons.draggable({
                handle: '.ui-handle'
            })

            this.AttachEvents();
        }

        private AttachEvents(): void {

            $(window).keypress((e) => {
                if (e.which === 32) {
                    this.TogglePlayStop(this.playComponents.$trainButtons.find('.ui-play-stop'));
                }
            });

            this.playComponents.$trainButtons.find('.ui-close').click(() => {
                this.board.hideTrainControls();
            });

            this.playComponents.$trainButtons.find('button').click((event) => {
                var $option = $(event.currentTarget);
                switch ($option.data("action").toLowerCase()) {
                    case "play": {
                        this.TogglePlayStop($option);
                        break;
                    }
                    case "forward": {
                        this.board.setGameSpeed(2);
                        break;
                    }
                }
            });

            this.playComponents.$trackButtons.find('button').click((event) => {
                var $option = $(event.currentTarget);
                switch ($option.data("action").toLowerCase()) {
                    case "pointer": {
                        this.board.setTool(trains.play.Tool.Pointer);
                        break;
                    }
                    case "train": {
                        this.board.setTool(trains.play.Tool.Train);
                        break;
                    }
                    case "pencil": {
                        this.board.setTool(trains.play.Tool.Track);
                        break;
                    }
                    case "eraser": {
                        this.board.setTool(trains.play.Tool.Eraser);
                        break;
                    }
                    case "rotate": {
                        this.board.setTool(trains.play.Tool.Rotate);
                        break;
                    }
                    case "bomb": {
                        var response = confirm("Are you sure buddy?");
                        if (response) {
                            this.board.destroyTrack();
                            this.board.setTool(trains.play.Tool.Track);
                        }
                        break;
                    }
                }
            });
        }

        TogglePlayStop($button: JQuery): void {
            var $icon = $button.find('i:first');
            if ($icon.hasClass("fa-play")) {
                this.board.showChooChoo();
                $icon.removeClass("fa-play").addClass("fa-stop");
            } else {
                this.board.stopChooChoo();
                $icon.removeClass("fa-stop").addClass("fa-play");
            }
        }
    }

    export function GetPlayComponent($container: JQuery): trains.play.PlayComponents {

        var $trainCanvas = $container.find('.ui-train-canvas');
        var $trackCanvas = $container.find('.ui-track-canvas');
        var $gridCanvas = $container.find('.ui-grid-canvas');

        return {
            $trainCanvas: $trainCanvas,
            $trackCanvas: $trackCanvas,
            $gridCanvas: $gridCanvas,
            $canvases: $().add($trainCanvas).add($trackCanvas).add($gridCanvas),
            $trackButtons: $container.find('.ui-track-buttons'),
            $trainButtons: $container.find('.ui-train-buttons')
        };
    }

    export interface PlayComponents {
        $trainCanvas: JQuery;
        $trackCanvas: JQuery;
        $gridCanvas: JQuery;
        $canvases: JQuery;
        $trackButtons: JQuery;
        $trainButtons: JQuery;
    }
}