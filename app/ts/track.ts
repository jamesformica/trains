/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
/// <reference path="play.cell.ts" />

module trains.play {

    export class Track extends Cell {
        draw(context: CanvasRenderingContext2D): void {
            context.save();
			//This is a comment - PushTest
            context.translate(this.x + 0.5, this.y + 0.5);
            trains.play.CellRenderer.clearCell(context);

            switch (this.direction) {
                case trains.play.Direction.Horizontal: {
                    var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                    trains.play.CellRenderer.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                    break;
                }
                case trains.play.Direction.Vertical: {
                    var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                    break;
                }
                case trains.play.Direction.LeftUp: {
                    this.leftUp(context, true);
                    break;
                }
                case trains.play.Direction.LeftDown: {
                    this.leftDown(context, true);
                    break;
                }
                case trains.play.Direction.RightUp: {
                    this.rightUp(context, true);
                    break;
                }
                case trains.play.Direction.RightDown: {
                    this.rightDown(context, true);
                    break;
                }
                case trains.play.Direction.Cross: {
                    trains.play.CellRenderer.drawStraightTrack(context, false, false);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawStraightTrack(context, false, false);
                    break;
                }
                case trains.play.Direction.LeftUpLeftDown: {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.leftDown(context, !this.switchState);
                    context.restore();
                    break;
                }
                case trains.play.Direction.LeftUpRightUp: {
                    context.save();
                    this.leftUp(context, this.switchState);
                    context.restore();
                    this.rightUp(context, !this.switchState);
                    context.restore();
                    break;   
                }
                case trains.play.Direction.RightDownRightUp: {
                    context.save();
                    this.rightDown(context, !this.switchState);
                    context.restore();
                    this.rightUp(context, this.switchState);
                    context.restore();
                    break;
                }
                case trains.play.Direction.RightDownLeftDown: {
                    context.save();
                    this.rightDown(context, !this.switchState);
                    context.restore();
                    this.leftDown(context, this.switchState);
                    context.restore();
                    break;
                }
            }
            context.restore();
        }
        
        rightDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(trains.play.gridSize, trains.play.gridSize);
            context.rotate(Math.PI);
            trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
        }
        
        rightUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(trains.play.gridSize, 0);
            context.rotate(Math.PI / 2);
            trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
        }
        
        leftUp(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
        }
        
        leftDown(context: CanvasRenderingContext2D, drawPlanks: boolean): void{
            context.translate(0, trains.play.gridSize);
            context.rotate(Math.PI * 1.5);
            trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
        }
        

        turnAroundBrightEyes(): void {
            if (this.direction === trains.play.Direction.RightDownLeftDown) {
                this.direction = trains.play.Direction.Vertical;
            } else {
                this.direction = this.direction + 1;
            }
            this.draw(trains.play.GameBoard.trackContext);
            var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row, true);
            neighbours.all.forEach((neighbour) => {
                neighbour.draw(trains.play.GameBoard.trackContext);
            });
        }
    }
}