/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />

module trains.play {

    export class Cell {

        private happy: boolean;
        private x: number;
        private y: number;
        private direction: trains.play.Direction;

        constructor(private board: trains.play.Board, public id: number, public column: number, public row: number) {
            this.happy = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.None;
        }

        draw(context: CanvasRenderingContext2D): void {
            context.save();

            context.translate(this.x + 0.5, this.y + 0.5);

            switch (this.direction) {
                case trains.play.Direction.Horizontal:
                {
                    trains.play.CellRenderer.drawStraightTrack(context);
                    break;
                }
                case trains.play.Direction.Vertical:
                {
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawStraightTrack(context);
                    break;
                }
                case trains.play.Direction.LeftUp:
                {
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.LeftDown:
                {
                    context.translate(0, trains.play.gridSize);
                    context.rotate(Math.PI * 1.5);
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.RightUp:
                {
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
                case trains.play.Direction.RightDown:
                {
                    context.translate(trains.play.gridSize, trains.play.gridSize);
                    context.rotate(Math.PI);
                    trains.play.CellRenderer.drawCurvedTrack(context);
                    break;
                }
            }

            context.restore();
        }

        neighbourlyUpdateTime(neighbours: trains.play.NeighbouringCells, previouslyUpdatedCells: Array<number>): void {

            var changed = this.determineDirection(neighbours);

            if (neighbours.aliveNeighbours.length > 1) {
                this.happy = this.canIBeHappyNow(neighbours);
            }

            if (changed) {
                previouslyUpdatedCells.push(this.id);
                neighbours.aliveNeighbours.forEach((neighbour) => {
                    if (previouslyUpdatedCells.indexOf(neighbour.id) === -1) {
                        neighbour.neighbourlyUpdateTime(this.board.getNeighbouringCells(neighbour.column, neighbour.row), previouslyUpdatedCells);
                    }
                });
            }
        }

        private determineDirection(neighbours: trains.play.NeighbouringCells): boolean {

            var newDirection: trains.play.Direction;
            if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                if (!this.happy) {
                    
                    if ((!neighbours.left.happy || this.isFacingRight(neighbours.left.direction)) && (!neighbours.up.happy || this.isFacingDown(neighbours.up.direction))) {
                        newDirection = trains.play.Direction.LeftUp;
                    }
                }
            }

            if (newDirection === undefined) {
                if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                    if (!this.happy) {
                        
                        if ((!neighbours.left.happy || this.isFacingRight(neighbours.left.direction)) && (!neighbours.down.happy || this.isFacingUp(neighbours.down.direction))) {
                            newDirection = trains.play.Direction.LeftDown;
                        }
                    }
                }
            }

            if (newDirection === undefined) {
                if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                    if (!this.happy) {
                        
                        if ((!neighbours.right.happy || this.isFacingLeft(neighbours.right.direction)) && (!neighbours.up.happy || this.isFacingDown(neighbours.up.direction))) {
                            newDirection = trains.play.Direction.RightUp;
                        }
                    }
                }
            }

            if (newDirection === undefined) {
                if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                    if (!this.happy) {
                        
                        if ((!neighbours.right.happy || this.isFacingLeft(neighbours.right.direction)) && (!neighbours.down.happy || this.isFacingUp(neighbours.down.direction))) {
                            newDirection = trains.play.Direction.RightDown;
                        }
                    }
                }
            }

            if (newDirection === undefined && !this.happy) {

                if ((neighbours.up !== undefined && (!neighbours.up.happy || this.isFacingDown(neighbours.up.direction))) || (neighbours.down !== undefined && (!neighbours.down.happy || this.isFacingUp(neighbours.down.direction)))) {
                    newDirection = trains.play.Direction.Vertical;
                }

                else if ((neighbours.left !== undefined && (!neighbours.left.happy || this.isFacingRight(neighbours.left.direction))) || (neighbours.right !== undefined && (!neighbours.right.happy || this.isFacingLeft(neighbours.right.direction)))) {
                    newDirection = trains.play.Direction.Horizontal;
                }

                else if (this.direction === trains.play.Direction.None) {
                    newDirection = trains.play.Direction.Horizontal;
                }
            }

            if (newDirection !== undefined && newDirection !== this.direction) {
                this.direction = newDirection;
                return true;
            }

            return false;
        }
        
        private canIBeHappyNow(neighbours: trains.play.NeighbouringCells): boolean {
            switch (this.direction) {
                case trains.play.Direction.Horizontal: {
                    if (neighbours.left !== undefined && neighbours.right !== undefined) return true;
                    break;
                }
                case trains.play.Direction.Vertical: {
                    if (neighbours.up !== undefined && neighbours.down !== undefined) return true;
                    break;
                }
                case trains.play.Direction.LeftUp: {
                    if (neighbours.left !== undefined && neighbours.up !== undefined) return true;
                    break;
                }
                case trains.play.Direction.LeftDown: {
                    if (neighbours.left !== undefined && neighbours.down !== undefined) return true;
                    break;
                }
                case trains.play.Direction.RightUp: {
                    if (neighbours.right !== undefined && neighbours.up !== undefined) return true;
                    break;
                }
                case trains.play.Direction.RightDown: {
                    if (neighbours.right !== undefined && neighbours.down !== undefined) return true;
                    break;
                }
            }
            
            return false;
        }
        
        private isFacingRight(direction: trains.play.Direction): boolean {
            if (direction === trains.play.Direction.Horizontal) return true;
            if (direction === trains.play.Direction.RightDown) return true;
            if (direction === trains.play.Direction.RightUp) return true;
            return false;
        }
        
        private isFacingDown(direction: trains.play.Direction): boolean {
            if (direction === trains.play.Direction.Vertical) return true;
            if (direction === trains.play.Direction.LeftDown) return true;
            if (direction === trains.play.Direction.RightDown) return true;
            return false;
        }
        
        private isFacingUp(direction: trains.play.Direction): boolean {
            if (direction === trains.play.Direction.Vertical) return true;
            if (direction === trains.play.Direction.LeftUp) return true;
            if (direction === trains.play.Direction.RightUp) return true;
            return false;
        }
        
        private isFacingLeft(direction: trains.play.Direction): boolean {
            if (direction === trains.play.Direction.Horizontal) return true;
            if (direction === trains.play.Direction.LeftDown) return true;
            if (direction === trains.play.Direction.LeftUp) return true;
            return false;
        }
    }
}