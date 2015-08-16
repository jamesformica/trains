/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.cell.ts" />

module trains.play {

    export var gridSize: number = 40;

    var gridColour: string = "#ddd";

    export class Board {

        private $window: JQuery;
        private $canvases: JQuery;

        private trainCanvas: HTMLCanvasElement;
        private trainContext: CanvasRenderingContext2D;
        private gridCanvas: HTMLCanvasElement;
        private gridContext: CanvasRenderingContext2D;

        private canvasWidth: number;
        private canvasHeight: number;

        private cells: BoardCells = {};
        private tool: Tool = Tool.Track;

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

            this.drawGrid();
        }


        drawGrid(): void {

            this.gridContext.beginPath();

            for (var x = gridSize; x < this.canvasWidth; x += gridSize) {
                this.gridContext.moveTo(x, 0);
                this.gridContext.lineTo(x, this.canvasHeight);
            }

            for (var y = gridSize; y < this.canvasHeight; y += gridSize) {
                this.gridContext.moveTo(0, y);
                this.gridContext.lineTo(this.canvasWidth, y);
            }

            this.gridContext.strokeStyle = gridColour;
            this.gridContext.stroke();
            this.gridContext.closePath();

        }

        redrawCells(): void {
            this.clearCells();

            for (var id in this.cells) {
                if (this.cells.hasOwnProperty(id)) {
                    if (!isNaN(id)) {
                        this.cells[id].draw();
                    }
                }
            }
        }

        clearCells(): void {
            this.trainContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }

        setTool(tool: Tool): void {
            this.tool = tool;
        }

        cellClick(event: MouseEvent): void {

            var column = this.getGridCoord(event.pageX - this.trainCanvas.offsetLeft);
            var row = this.getGridCoord(event.pageY - this.trainCanvas.offsetTop);

            switch (this.tool) {
                case Tool.Track:
                {
                    this.newTrack(column, row);
                    break;
                }
                case Tool.Eraser:
                {
                    this.eraseTrack(column, row);
                    break;
                }
            }
        }

        newTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] === undefined) {
                var newCell = new trains.play.Cell(cellID, trains.play.Direction.Right, column, row, this.trainContext);
                this.cells[newCell.id] = newCell;
                this.redrawCells();
            }
        }

        eraseTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] !== undefined) {
                delete this.cells[cellID];
                this.redrawCells();
            }
        }

        roundToNearestGridSize(value: number): number {
            return Math.round(value / gridSize) * gridSize;
        }

        getGridCoord(value: number): number {
            return Math.floor(value / gridSize);
        }

        getCellID(column: number, row: number): number {
            return Number(column.toString() + row.toString());
        }
    }

    interface BoardCells {
        [position: number]: trains.play.Cell
    }

    export enum Tool {
        Track,
        Eraser
    }

    export enum Direction {
        Up,
        Right,
        Down,
        Left,
        UpRight,
        UpLeft,
        RightUp,
        RightDown,
        DownLeft,
        DownRight,
        LeftDown,
        LeftUp
    }

}