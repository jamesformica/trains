/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.cell.ts" />

module trains.play {

    export var gridSize: number = 40;

    var gridColour: string = "#ddd";

    export class Board {

        private $window: JQuery;
        private $canvases: JQuery;

        private trainCanvas: HTMLCanvasElement;
        public trainContext: CanvasRenderingContext2D;
        private gridCanvas: HTMLCanvasElement;
        private gridContext: CanvasRenderingContext2D;

        private canvasWidth: number;
        private canvasHeight: number;

        private cells: trains.play.BoardCells = {};
        private tool: Tool = trains.play.Tool.Track;

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


        private drawGrid(): void {

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

        private redrawCells(): void {
            this.clearCells();

            for (var id in this.cells) {
                if (this.cells.hasOwnProperty(id)) {
                    if (!isNaN(id)) {
                        this.cells[id].draw();
                    }
                }
            }
        }

        private clearCells(): void {
            this.trainContext.beginPath();
            this.trainContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.trainContext.closePath();
        }

        setTool(tool: Tool): void {
            this.tool = tool;
        }

        private cellClick(event: MouseEvent): void {

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

        private newTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] === undefined) {
                var newCell = new trains.play.Cell(this, cellID, column, row);
                this.cells[newCell.id] = newCell;

                newCell.neighbourlyUpdateTime(this.getNeighbouringCells(column, row), []);

                this.redrawCells();
            }
        }

        private eraseTrack(column: number, row: number): void {
            var cellID = this.getCellID(column, row);

            if (this.cells[cellID] !== undefined) {
                delete this.cells[cellID];
                this.redrawCells();
            }
        }

        private roundToNearestGridSize(value: number): number {
            return Math.round(value / gridSize) * gridSize;
        }

        private getGridCoord(value: number): number {
            return Math.floor(value / gridSize);
        }

        getCellID(column: number, row: number): number {
            return Number(column.toString() + row.toString());
        }

        getNeighbouringCells(column: number, row: number): trains.play.NeighbouringCells {

            var up = this.cells[this.getCellID(column, row - 1)];
            var right = this.cells[this.getCellID(column + 1, row)];
            var down = this.cells[this.getCellID(column, row + 1)];
            var left = this.cells[this.getCellID(column - 1, row)];
            var aliveNeighbours = [up, right, down, left].filter(n => n !== undefined);

            return {
                up: up,
                right: right,
                down: down,
                left: left,
                aliveNeighbours: aliveNeighbours
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
        aliveNeighbours: Array<trains.play.Cell>;
    }

    export enum Tool {
        Track,
        Eraser
    }

    export enum Direction {
        Vertical,
        Horizontal,
        RightUp,
        RightDown,
        LeftDown,
        LeftUp
    }

}