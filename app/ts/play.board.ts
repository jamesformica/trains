/// <reference path="../types/jquery.d.ts" />
/// <reference path="play.cell.ts" />

module trains.play {

    export var gridSize:number = 40;

    var gridColour:string = "#ddd";

    export class Board {

        private $window:JQuery;
        private $canvases:JQuery;

        private trainCanvas:HTMLCanvasElement;
        private trainContext:CanvasRenderingContext2D;
        private gridCanvas:HTMLCanvasElement;
        private gridContext:CanvasRenderingContext2D;

        private canvasWidth:number;
        private canvasHeight:number;

        constructor(private $trainCanvas:JQuery, private $gridCanvas:JQuery) {

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

            this.trainCanvas.addEventListener('click', (event:MouseEvent) => this.newTrack(event));

            this.drawGrid();
        }


        drawGrid():void {

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

        newTrack(event:MouseEvent):void {

            var x = this.floorToNearestGridSize(event.pageX - this.trainCanvas.offsetLeft);
            var y = this.floorToNearestGridSize(event.pageY - this.trainCanvas.offsetTop);

            new trains.play.Cell(x, y, this.trainContext).draw();

        }


        roundToNearestGridSize(value:number) {
            return Math.round(value / gridSize) * gridSize;
        }

        floorToNearestGridSize(value:number) {
            return Math.floor(value / gridSize) * gridSize;
        }

    }

}