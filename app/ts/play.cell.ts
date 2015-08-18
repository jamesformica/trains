/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />

module trains.play {

    export class Cell {

        private locked: boolean;
        private x: number;
        private y: number;
        private direction: trains.play.Direction;

        constructor(private board: trains.play.Board, public id: number, public column: number, public row: number) {
            this.locked = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.Horizontal;
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
            var changed: boolean = false;

            if (!this.locked) {
                changed = this.determineDirection(neighbours);
            } else {
                // only try and re-update if it has 1 or 2 neighbours
                if (neighbours.aliveNeighbours.length <= 2) {
                    changed = this.determineDirection(neighbours);
                }
            }

            if (changed) {
                this.locked = true;
                previouslyUpdatedCells.push(this.id);
                neighbours.aliveNeighbours.forEach((neighbour) => {
                    if (previouslyUpdatedCells.indexOf(neighbour.id) === -1) {
                        neighbour.neighbourlyUpdateTime(this.board.getNeighbouringCells(neighbour.column, neighbour.row), previouslyUpdatedCells);
                    }
                });
            }
        }

        private determineDirection(neighbours: trains.play.NeighbouringCells): boolean {

            var changed = false;
            if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                // IF the guy on the left only has 1 neighbour
                this.direction = trains.play.Direction.LeftUp;
                changed = true;
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                this.direction = trains.play.Direction.LeftDown;
                changed = true;
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                this.direction = trains.play.Direction.RightUp;
                changed = true;
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                this.direction = trains.play.Direction.RightDown;
                changed = true;
            }

            if (!changed) {

                if (neighbours.up !== undefined || neighbours.down !== undefined) {
                    this.direction = trains.play.Direction.Vertical;
                    changed = true;
                }

                else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                    this.direction = trains.play.Direction.Horizontal;
                    changed = true;
                }
            }

            return changed;
        }
    }

}