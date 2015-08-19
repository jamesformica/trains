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

            // this needs to be smarts to check if actually connected to something
            if (neighbours.aliveNeighbours.length > 1) {
                this.happy = true;
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

        private onlyOneNeighbourOrTwoIncludingMe(neighbourOne: trains.play.Cell, neighbourTwo: trains.play.Cell): boolean {

            var onesNeighbours = this.board.getNeighbouringCells(neighbourOne.column, neighbourOne.row);
            var twosNeighbours = this.board.getNeighbouringCells(neighbourTwo.column, neighbourTwo.row);

            if (onesNeighbours.aliveNeighbours.length === 1 || twosNeighbours.aliveNeighbours.length === 1) {
                return true;
            }

            // if they both have two neighbours
            if (onesNeighbours.aliveNeighbours.length === 2 && twosNeighbours.aliveNeighbours.length === 2) {

                // if one of them is this cell
                if ((onesNeighbours.aliveNeighbours[0].id === this.id || onesNeighbours.aliveNeighbours[1].id === this.id) || (twosNeighbours.aliveNeighbours[0].id === this.id || twosNeighbours.aliveNeighbours[1].id === this.id)) {
                    return true;
                }
            }

            return false;
        }

        private determineDirection(neighbours: trains.play.NeighbouringCells): boolean {

            var newDirection: trains.play.Direction;
            if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {

                if (!this.happy) {
                    newDirection = trains.play.Direction.LeftUp;
                }
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                if (!this.happy) {
                    newDirection = trains.play.Direction.LeftDown;
                }
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                if (!this.happy) {
                    newDirection = trains.play.Direction.RightUp;
                }
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                if (!this.happy) {
                    newDirection = trains.play.Direction.RightDown;
                }
            }

            if (newDirection === undefined && !this.happy) {

                if (neighbours.up !== undefined || neighbours.down !== undefined) {
                    newDirection = trains.play.Direction.Vertical;
                }

                else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                    newDirection = trains.play.Direction.Horizontal;
                }

                else {
                    newDirection = trains.play.Direction.Horizontal;
                }
            }

            if (newDirection !== undefined && newDirection !== this.direction) {
                this.direction = newDirection;
                return true;
            }

            return false;
        }
    }
}