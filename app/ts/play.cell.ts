/// <reference path="play.board.ts" />

module trains.play {

    export class Cell {

        constructor(private x:number, private y:number, private trainContext:CanvasRenderingContext2D) {

        }

        draw():void {
            this.trainContext.rect(this.x, this.y, trains.play.gridSize, trains.play.gridSize);
            this.trainContext.fillStyle = "purple";
            this.trainContext.fill();
        }

    }

}