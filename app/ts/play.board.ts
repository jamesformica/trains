/// <reference path="../types/jquery.d.ts" />
/// <reference path="../types/awesomeCursor.d.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />

module trains.play {

    export var gridSize: number = 40;
    export var gridColour: string = "#eee";

    export var trackWidth = 4;
    export var trackPadding = 10;
    export var firstTrackPosY = trackPadding;
    export var secondTrackPosY = trains.play.gridSize - trackPadding;

    export class Board {

        private $window: JQuery;
        private $canvases: JQuery;

        private trainCanvas: HTMLCanvasElement;
        public trainContext: CanvasRenderingContext2D;
        private gridCanvas: HTMLCanvasElement;
        private gridContext: CanvasRenderingContext2D;

        public canvasWidth: number;
        public canvasHeight: number;

        private cells: trains.play.BoardCells = {};
        private tool: Tool;
        
        constructor(private $trainCanvas: JQuery, private $gridCanvas: JQuery) {

            this.$window = $(window);
            this.$canvases = $().add($trainCanvas).add($gridCanvas);

            this.trainCanvas = <HTMLCanvasElement>this.$trainCanvas.get(0);
            this.trainContext = this.trainCanvas.getContext("2d");

            this.gridCanvas = <HTMLCanvasElement>this.$gridCanvas.get(0);
            this.gridContext = this.gridCanvas.getContext("2d");

            this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (gridSize * 2));
            this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - (gridSize * 2));

            this.$canvases.attr('width', this.canvasWidth);
            this.$canvases.attr('height', this.canvasHeight);
            this.$canvases.width(this.canvasWidth);
            this.$canvases.css('top', (this.$window.height() - this.canvasHeight) / 2);
            this.$canvases.css('left', (this.$window.width() - this.canvasWidth) / 2);

            this.trainCanvas.addEventListener('click', (event: MouseEvent) => this.cellClick(event));
            this.trainCanvas.addEventListener('mousemove', (event: MouseEvent) => this.cellMoveOver(event));
            this.trainCanvas.addEventListener('touchstart', (event: any) => false);
            this.trainCanvas.addEventListener('touchmove', (event: any) => this.cellTouch(event));
            this.trainCanvas.addEventListener('contextmenu', (ev) => {
                this.cellRightClick(ev);
                ev.preventDefault();
                return false; }, false);
                
            this.setTool(trains.play.Tool.Track);
            
            trains.play.BoardRenderer.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight);
        }
        
        redraw(): void {
            trains.play.BoardRenderer.redrawCells(this.cells, this.trainContext, this.canvasWidth, this.canvasHeight);
        }            

        setTool(tool: Tool): void {
            if (tool !== this.tool) {
                this.tool = tool;
                
                var cursorName;
                switch (tool) {
                    case trains.play.Tool.Track: {
                        cursorName = "pencil";
                        break;
                    }
                    case trains.play.Tool.Eraser: {
                        cursorName = "eraser";
                        break;
                    }
                    case trains.play.Tool.Rotate: {
                        cursorName = "recycle";
                        break;
                    }
                }
                
                $('body').css('cursor', '');
                $('body').awesomeCursor(cursorName, {
                    hotspot: 'bottom left'
                })
            }
        }
        
        private cellMoveOver(event: MouseEvent): void {
            if (event.buttons === 1) {
                this.cellClick(event);
            }
        }


        private cellTouch(event: any): void {
            var column = this.getGridCoord(event.touches[0].pageX - this.trainCanvas.offsetLeft);
            var row = this.getGridCoord(event.touches[0].pageY - this.trainCanvas.offsetTop);
            this.doTool(column, row, event.shiftKey);
        }
        
        private cellRightClick(event: MouseEvent): void {
            var column = this.getGridCoord(event.pageX - this.trainCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trainCanvas.offsetTop);
            this.eraseTrack(column, row);
        }
        
        private cellClick(event: MouseEvent): void {
            var column = this.getGridCoord(event.pageX - this.trainCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trainCanvas.offsetTop);

            this.doTool(column, row, event.shiftKey);
        }
        
        private doTool(column: number, row: number, shift: boolean): void {
            switch (this.tool) {
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
                }
            }
        }
        
        public destroyTrack(): void {
            
            var deferreds = new Array<JQueryDeferred<{}>>();
            for (var id in this.cells) {
                if (this.cells.hasOwnProperty(id)) {
                    if (!isNaN(id)) {
                        deferreds.push(this.cells[id].destroy());
                    }
                }
            }

            $.when.apply($, deferreds).done(() => {
                trains.play.BoardRenderer.clearCells(this.trainContext, this.canvasWidth, this.canvasHeight);
                this.cells = [];
            });
        }
        
        private rotateTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);
            var cell = this.cells[cellID];
            if (cell !== undefined) {
                if (cell.direction === trains.play.Direction.LeftUp) {
                    cell.direction = trains.play.Direction.Vertical;
                } else {
                    cell.direction = cell.direction + 1;
                }
                cell.draw(this.trainContext);
            }
        }

        private newTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] === undefined) {
                var newCell = new trains.play.Cell(this, cellID, column, row);
                this.cells[newCell.id] = newCell;

                newCell.checkYourself();
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

        private roundToNearestGridSize(value: number): number {
            return Math.round(value / gridSize) * gridSize;
        }

        private getGridCoord(value: number): number {
            return Math.floor(value / gridSize);
        }

        getCellID(column: number, row: number): string {
            return column.toString() + ':' + row.toString();
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
    }

    export interface BoardCells {
        [position: number]: trains.play.Cell;
    }

    export interface NeighbouringCells {
        up: trains.play.Cell;
        right: trains.play.Cell;
        down: trains.play.Cell;
        left: trains.play.Cell;
        all: Array<trains.play.Cell>;
    }

    export enum Tool {
        Track,
        Eraser,
        Rotate
    }

    export enum Direction {
        None,
        Vertical,
        Horizontal,
        RightUp,
        RightDown,
        LeftDown,
        LeftUp
    }

}