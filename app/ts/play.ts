/// <reference path="../types/jquery.d.ts" />
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
            this.playComponents.$trackButtons.css("top", top);
            this.playComponents.$trainButtons.css("line-height", top + "px");
            
            this.AttachEvents();
        }

        private AttachEvents(): void {
            
            this.playComponents.$trainButtons.find('button').click((event) => {
                var $option = $(event.currentTarget);
                switch ($option.data("action").toLowerCase()) {
                    case "play": {
                        this.playComponents.$trainCanvas.show();
                        this.board.showChooChoo();
                        break;
                    }
                    case "stop": {
                        this.playComponents.$trainCanvas.hide();
                        this.board.stopChooChoo();
                    }
                }
            });

            this.playComponents.$trackButtons.find('button').click((event) => {
                var $option = $(event.currentTarget);
                switch ($option.data("action").toLowerCase()) {
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