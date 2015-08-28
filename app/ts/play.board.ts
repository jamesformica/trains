/// <reference path="../types/jquery.d.ts" />
/// <reference path="../types/awesomeCursor.d.ts" />
/// <reference path="play.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="track.ts" />
/// <reference path="play.loop.game.ts" />
/// <reference path="play.loop.render.ts" />
/// <reference path="audio.ts" />

module trains.play {

    export var gridSize: number = 40;
    export var gridColour: string = "#eee";

    export var trackWidth = 4;
    export var trackPadding = 10;
    export var firstTrackPosY = trackPadding;
    export var secondTrackPosY = trains.play.gridSize - trackPadding;
    
    export var animationEndEventString = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend";

    export class Board {

        private $window: JQuery;

        public trainCanvas: HTMLCanvasElement;
        public trainContext: CanvasRenderingContext2D;
        private trackCanvas: HTMLCanvasElement;
        public trackContext: CanvasRenderingContext2D;
        private gridCanvas: HTMLCanvasElement;
        private gridContext: CanvasRenderingContext2D;
        private trainLogoCanvas: HTMLCanvasElement;
        public trainLogoContext: CanvasRenderingContext2D;

        public lightingBufferCanvas: HTMLCanvasElement;
        public lightingBufferContext: CanvasRenderingContext2D;

        public canvasWidth: number;
        public canvasHeight: number;
        
        private maxColumns: number;
        private maxRows: number;

        private cells: trains.play.BoardCells = {};
        private tool: Tool;
        
        private trainIDCounter = 0;
        public trains = new Array<trains.play.Train>();
        public selectedTrain: trains.play.Train;
        private gameRunningState = true;
        public gameStartTime = (new Date().getTime());
        private player: trains.audio.Player;

        public gameLoop: trains.play.GameLoop;
        public renderLoop: trains.play.RenderLoop;
        public showDiagnostics = false;
        
        constructor(public playComponents: trains.play.PlayComponents) {

            this.$window = $(window);

            this.trainCanvas = <HTMLCanvasElement>this.playComponents.$trainCanvas.get(0);
            this.trainContext = this.trainCanvas.getContext("2d");

            this.trackCanvas = <HTMLCanvasElement>this.playComponents.$trackCanvas.get(0);
            this.trackContext = this.trackCanvas.getContext("2d");

            this.gridCanvas = <HTMLCanvasElement>this.playComponents.$gridCanvas.get(0);
            this.gridContext = this.gridCanvas.getContext("2d");
            
            this.trainLogoCanvas = <HTMLCanvasElement>this.playComponents.$trainLogoCanvas.get(0);
            this.trainLogoContext = this.trainLogoCanvas.getContext("2d");
            
            this.playComponents.$trainLogoCanvas.attr('width', gridSize);
            this.playComponents.$trainLogoCanvas.attr('height', gridSize);
            this.playComponents.$trainLogoCanvas.width(gridSize);
            this.playComponents.$trainLogoCanvas.height(gridSize);

            this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (gridSize * 2));
            this.maxColumns = this.canvasWidth / gridSize;
            this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - gridSize);
            this.maxRows = this.canvasHeight / gridSize;

            this.playComponents.$canvases.attr('width', this.canvasWidth);
            this.playComponents.$canvases.attr('height', this.canvasHeight);
            this.playComponents.$canvases.width(this.canvasWidth);
            this.playComponents.$canvases.css('top', (this.$window.height() - this.canvasHeight) / 2);
            this.playComponents.$canvases.css('left', (this.$window.width() - this.canvasWidth) / 2);

            [this.trackCanvas, this.trainCanvas].forEach(el => {            
                el.addEventListener('click', (event: MouseEvent) => this.cellClick(event));
                el.addEventListener('mousemove', (event: MouseEvent) => this.cellMoveOver(event));
                el.addEventListener('touchstart', (event: any) => false);
                el.addEventListener('touchmove', (event: any) => {
                    this.cellTouch(event);
                    event.preventDefault();
                    return false;
                });
                el.addEventListener('contextmenu', (ev) => {
                    this.cellRightClick(ev);
                    ev.preventDefault();
                    return false; }, false);
            });

            //Hidden canvas buffer
            this.lightingBufferCanvas = <HTMLCanvasElement>document.createElement('canvas');
            this.lightingBufferCanvas.width = this.canvasWidth;
            this.lightingBufferCanvas.height = this.canvasHeight;
            this.lightingBufferContext = this.lightingBufferCanvas.getContext("2d");
            
            this.gameLoop = new GameLoop(this);
            this.renderLoop = new RenderLoop(this);
            trains.play.BoardRenderer.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight);
            this.gameLoop.startLoop();
            this.renderLoop.startLoop();
            this.player = new trains.audio.Player();
            
            setTimeout(() => {
                this.setTool(trains.play.Tool.Track);
            }, 100);
        }

        public startGame(): void {
            this.gameRunningState = true;
        }

        public stopGame(): void {
            this.gameRunningState = false;
        }

        redraw(): void {
            trains.play.BoardRenderer.redrawCells(this.cells, this.trackContext, this.canvasWidth, this.canvasHeight);
        }

        private setTool(tool: Tool): void {
            if (tool !== this.tool) {
                this.tool = tool;
                
                var cursorName;
                var hotspot = 'bottom left';
                switch (tool) {
                    case trains.play.Tool.Pointer: {
                        cursorName = "hand-pointer-o";
                        hotspot = 'top left';
                        break;
                    }
                    case trains.play.Tool.Track: {
                        cursorName = "pencil";
                        break;
                    }
                    case trains.play.Tool.Train: {
                        cursorName = "train";
                        hotspot = 'center';
                        break;
                    }
                    case trains.play.Tool.Eraser: {
                        cursorName = "eraser";
                        break;
                    }
                    case trains.play.Tool.Rotate: {
                        cursorName = "refresh";
                        hotspot = 'center';
                        break;
                    }
                }
                
                $('body').css('cursor', '');
                $('body').awesomeCursor(cursorName, {
                    hotspot: hotspot,
                    size: 22
                });
            }
        }
        
        private cellMoveOver(event: MouseEvent): void {
            if (event.buttons === 1 && this.tool !== Tool.Train) {
                this.cellClick(event);
            }
        }

        private cellTouch(event: any): void {
            if (this.tool === Tool.Train) return;
            
            var column = this.getGridCoord(event.touches[0].pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.touches[0].pageY - this.trackCanvas.offsetTop);
            this.doTool(column, row, event.shiftKey);
        }
        
        private cellRightClick(event: MouseEvent): void {
            var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
            this.eraseTrack(column, row);
        }
        
        private cellClick(event: MouseEvent): void {
            var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);

            this.doTool(column, row, event.shiftKey);
        }
        
        private doTool(column: number, row: number, shift: boolean): void {
            if (row >= this.maxRows || column >= this.maxColumns) return;
                
            switch (this.tool) {
                case Tool.Pointer:
                {
                    this.pointAtThing(column, row);
                    break;    
                }
                case Tool.Track:
                {
                    if (shift) {
                        this.rotateTrack(column, row);
                    } else {
                        this.newTrack(column, row);
                    }
                    break;
                }
                case Tool.Eraser:
                {
                    this.eraseTrack(column, row);
                    break;
                }
                case Tool.Rotate:
                {
                    this.rotateTrack(column, row);
                    break;    
                }
                case Tool.Train:
                {
                    var cellID = this.getCellID(column, row);

                    if (this.cells[cellID] !== undefined) {
                        var t = new Train(this.trainIDCounter++, this, this.cells[cellID]);
                        //Pre-move train to stop rendering at an odd angle.
                        t.chooChooMotherFucker(0.1);
                        this.trains.push(t);
                        this.showTrainControls(t);
                    }
                    break;    
                }        
            }
        }
        
        private destroyTrack(): void {
            this.hideTrainControls();
            this.trains = new Array<Train>();
            var deferreds = new Array<JQueryDeferred<{}>>();
            for (var id in this.cells) {
                if (this.cells.hasOwnProperty(id)) {
                    deferreds.push(this.cells[id].destroy());
                }
            }

            $.when.apply($, deferreds).done(() => {
                trains.play.BoardRenderer.clearCells(this.trackContext, this.canvasWidth, this.canvasHeight);
                trains.play.BoardRenderer.clearCells(this.trainContext, this.canvasWidth, this.canvasHeight);
                this.cells = {};
            });
        }
        
        private rotateTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);
            var cell: trains.play.Cell = this.cells[cellID];
            if (cell !== undefined) {
                cell.turnAroundBrightEyes();
            }
        }

        private newTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] === undefined) {
                
                this.player.playSound(trains.audio.Sound.click);
                var newCell = new trains.play.Track(this, cellID, column, row);
                
                this.cells[newCell.id] = newCell;

                if (!newCell.crossTheRoad()) {
                    newCell.checkYourself();
                } 
            }
        }

        private eraseTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            var cell = this.cells[cellID];            
            if (cell !== undefined) {
                delete this.cells[cellID];
                cell.destroy().done(() => {
                    var neighbours = this.getNeighbouringCells(column, row, true);

                    // some of my neighbours may need to be less happy now
                    if (neighbours.up !== undefined && neighbours.up.happy && neighbours.up.isConnectedDown()) neighbours.up.happy = false;
                    if (neighbours.down !== undefined && neighbours.down.happy && neighbours.down.isConnectedUp()) neighbours.down.happy = false;
                    if (neighbours.left !== undefined && neighbours.left.happy && neighbours.left.isConnectedRight()) neighbours.left.happy = false;
                    if (neighbours.right !== undefined && neighbours.right.happy && neighbours.right.isConnectedLeft()) neighbours.right.happy = false;
                    
                    neighbours.all.forEach(n => n.checkYourself()); 
                });
            }
        }
        
        private pointAtThing(column: number, row: number): void {
            this.trains.forEach((train) => {
                if (train.isTrainHere(column, row)) {
                    this.showTrainControls(train);
                }
            });
        }
        
        showChooChoo(): void {
            this.startGame();
        }
        
        stopChooChoo(): void {
            this.stopGame();
        }

        private roundToNearestGridSize(value: number): number {
            return Math.floor(value / gridSize) * gridSize;
        }

        getGridCoord(value: number): number {
            return Math.floor(value / gridSize);
        }

        getCellID(column: number, row: number): string {
            return column.toString() + ':' + row.toString();
        }
        
        getCell(column: number, row: number): trains.play.Cell {
            return this.cells[this.getCellID(column, row)];
        }

        getNeighbouringCells(column: number, row: number, includeHappyNeighbours: boolean = false): trains.play.NeighbouringCells {
            var up = this.cells[this.getCellID(column, row - 1)];
            var right = this.cells[this.getCellID(column + 1, row)];
            var down = this.cells[this.getCellID(column, row + 1)];
            var left = this.cells[this.getCellID(column - 1, row)];

            // if any of the neighbours are happy, and not happy with us, then we need to ignore them
            if (!includeHappyNeighbours) {
                if (up !== undefined && up.happy && !up.isConnectedDown()) up = undefined;
                if (right !== undefined && right.happy && !right.isConnectedLeft()) right = undefined;
                if (down !== undefined && down.happy && !down.isConnectedUp()) down = undefined;
                if (left !== undefined && left.happy && !left.isConnectedRight()) left = undefined;
            }
            
            var all = [up, right, down, left].filter(n => n !== undefined);
            
            return {
                up: up,
                right: right,
                down: down,
                left: left,
                all: all
            };
        }
        
        trackControlClick(option: EventTarget): void {
             var $option = $(option);
                switch ($option.data("action").toLowerCase()) {
                    case "pointer": {
                        this.setTool(trains.play.Tool.Pointer);
                        break;
                    }
                    case "train": {
                        this.setTool(trains.play.Tool.Train);
                        break;
                    }
                    case "pencil": {
                        this.setTool(trains.play.Tool.Track);
                        break;
                    }
                    case "eraser": {
                        this.setTool(trains.play.Tool.Eraser);
                        break;
                    }
                    case "rotate": {
                        this.setTool(trains.play.Tool.Rotate);
                        break;
                    }
                    case "bomb": {
                        var response = confirm("Are you sure buddy?");
                        if (response) {
                            this.destroyTrack();
                            this.setTool(trains.play.Tool.Track);
                        }
                        break;
                    }
                }
        }
        
        trainControlClick(option: EventTarget): void {
            if (this.selectedTrain !== undefined) {
                var $option = $(option);
                switch ($option.data("action").toLowerCase()) {
                    case "play": {
                        this.selectedTrain.wakeMeUp();
                        break;
                    }
                    case "pause": {
                        this.selectedTrain.hammerTime();
                        break;
                    }
                    case "forward": {
                        this.selectedTrain.fasterFasterFaster();
                        break;
                    }
                    case "backward": {
                        this.selectedTrain.slowYourRoll();
                        break;
                    }    
                    case "delete": {
                        for (var i = 0; i < this.trains.length; i++) {
                            if (this.trains[i].id === this.selectedTrain.id) {
                                this.trains.splice(i, 1);
                                this.hideTrainControls();
                                break;
                            }
                        }
                        break;
                    }
                    case "turnaround": {
                        this.selectedTrain.turnTheBeatAround();
                        break;
                    }
                }
            } else {
                this.hideTrainControls();
            }
        }
        
        showTrainControls(train: trains.play.Train): void {
            this.selectedTrain = train;
            this.playComponents.$trainName.text(train.name);
            this.playComponents.$trainButtons.addClass("flipInX").show();
            this.playComponents.$trainButtons.one(trains.play.animationEndEventString, () => {
                this.playComponents.$trainButtons.removeClass("flipInX");
            });
        }
        
        hideTrainControls(): void {
            this.selectedTrain = undefined;
            this.playComponents.$trainButtons.addClass("flipOutX");
            this.playComponents.$trainButtons.one(trains.play.animationEndEventString, () => {
                this.playComponents.$trainButtons.removeClass("flipOutX").hide();
            });
        }
        
        setMuted(mute: boolean): void {
            this.player.setMuted(mute);
        }
    }

    export interface BoardCells {
        [position: string]: trains.play.Cell;
    }

    export interface NeighbouringCells {
        up: trains.play.Cell;
        right: trains.play.Cell;
        down: trains.play.Cell;
        left: trains.play.Cell;
        all: Array<trains.play.Cell>;
    }

    export enum Tool {
        Pointer,
        Track,
        Eraser,
        Rotate,
        Train
    }

    export enum Direction {
        None,
        Vertical,
        Horizontal,
        RightUp,
        RightDown,
        LeftDown,
        LeftUp,
        Cross
    }

}