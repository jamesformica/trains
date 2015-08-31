/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />
/// <reference path="play.train.ts" />
/// <reference path="util.ts" />

module trains.play {

    export class TrainCarriage extends Train {

        constructor(public id: number, cell: Cell) {
            super(id, cell);
        }

        public draw(context: CanvasRenderingContext2D, translate: boolean = true): void {
            var x = this.coords.currentX;
            var y = this.coords.currentY;
            var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);

            context.save();

            if (translate) {
                context.translate(x, y);
                context.rotate((angle * -1) + ((this.imageReverse < 0) ? Math.PI : 0));
            }
            else {
                context.translate(play.gridSize / 2, play.gridSize / 2);
            }

            trains.play.TrainRenderer.DrawCarriage(context, this.trainColourIndex);

            context.restore();

            if ((this.carriage !== undefined) && translate) {
                this.carriage.draw(context, translate);
                this.drawLink(context);
            }
        }

        public drawLighting(context: CanvasRenderingContext2D): void {
            //Do nothing
        }
    }
}