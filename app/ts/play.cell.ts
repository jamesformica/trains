/// <reference path="play.board.ts" />

module trains.play {

    export class Cell {

        private locked: boolean;
        private x: number;
        private y: number;

        constructor(public id: number, public direction: trains.play.Direction, private column: number, private row: number, private trainContext: CanvasRenderingContext2D) {
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.locked = false;
        }

        draw(): void {
            this.trainContext.beginPath();
            this.trainContext.rect(this.x, this.y, trains.play.gridSize, trains.play.gridSize);
            this.trainContext.fillStyle = "purple";
            this.trainContext.fill();
            this.trainContext.closePath();
        }
    }

}