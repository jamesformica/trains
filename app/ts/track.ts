/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
/// <reference path="play.cell.ts" />

module trains.play {

    export class Track extends Cell {
        draw(context: CanvasRenderingContext2D): void {
            context.save();

            context.translate(this.x + 0.5, this.y + 0.5);
            trains.play.CellRenderer.clearCell(context);

            switch (this.direction) {
                case trains.play.Direction.Horizontal: {
                    var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                    trains.play.CellRenderer.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                    break;
                }
                case trains.play.Direction.Vertical: {
                    var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                    break;
                }
                case trains.play.Direction.LeftUp: {
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.LeftDown: {
                    context.translate(0, trains.play.gridSize);
                    context.rotate(Math.PI * 1.5);
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.RightUp: {
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.RightDown: {
                    context.translate(trains.play.gridSize, trains.play.gridSize);
                    context.rotate(Math.PI);
                    trains.play.CellRenderer.drawCurvedTrack(context);
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
                    this.leftUp(context);
                    this.leftDown(context);
                    break;
                }
                case trains.play.Direction.LeftUpRightUp: {
                    this.leftUp(context);
                    this.rightUp(context);
                    break;   
                }
                case trains.play.Direction.RightDownRightUp: {
                    this.rightDown(context);
                    this.rightUp(context);
                    break;
                }
                case trains.play.Direction.RightDownLeftDown: {
                    this.rightDown(context);
                    this.leftDown(context);
                    break;
                }
            }
            context.restore();
        }
        
        rightDown(context: CanvasRenderingContext2D): void{
            context.translate(trains.play.gridSize, trains.play.gridSize);
            context.rotate(Math.PI);
            trains.play.CellRenderer.drawCurvedTrack(context);
        }
        
        rightUp(context: CanvasRenderingContext2D): void{
            context.translate(trains.play.gridSize, 0);
            context.rotate(Math.PI / 2);
            trains.play.CellRenderer.drawCurvedTrack(context);
        }
        
        leftUp(context: CanvasRenderingContext2D): void{
            trains.play.CellRenderer.drawCurvedTrack(context);
        }
        
        leftDown(context: CanvasRenderingContext2D): void{
            context.translate(0, trains.play.gridSize);
            context.rotate(Math.PI * 1.5);
            trains.play.CellRenderer.drawCurvedTrack(context);
        }
        

        turnAroundBrightEyes(): void {
            if (this.direction === trains.play.Direction.Cross) {
                this.direction = trains.play.Direction.Vertical;
            } else {
                this.direction = this.direction + 1;
            }
            this.draw(this.board.trackContext);
            var neighbours = this.board.getNeighbouringCells(this.column, this.row, true);
            neighbours.all.forEach((neighbour) => {
                neighbour.draw(this.board.trackContext);
            });
        }
    }
}