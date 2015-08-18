/// <reference path="play.board.ts" />

module trains.play {

    export class Cell {

        private locked: boolean;
        private x: number;
        private y: number;
        private direction: trains.play.Direction;

        private trackWidth = 4;
        private trackPadding = 10;

        private firstTrackPosY = this.trackPadding;
        private secondTrackPosY = trains.play.gridSize - this.trackPadding;

        constructor(private board: trains.play.Board, public id: number, public column: number, public row: number) {
            this.locked = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.Horizontal;
        }

        draw(): void {
            this.board.trainContext.save();

            this.board.trainContext.translate(this.x + 0.5, this.y + 0.5);

            switch (this.direction) {
                case trains.play.Direction.Horizontal:
                {
                    this.drawStraightTrack();
                    break;
                }
                case trains.play.Direction.Vertical:
                {
                    this.board.trainContext.translate(trains.play.gridSize, 0);
                    this.board.trainContext.rotate(Math.PI / 2);
                    this.drawStraightTrack();
                    break;
                }
                case trains.play.Direction.LeftUp:
                {
                    this.drawCurvedTrack();
                    break;
                }
                case trains.play.Direction.RightDown:
                {
                    this.board.trainContext.translate(trains.play.gridSize, trains.play.gridSize);
                    this.board.trainContext.rotate(Math.PI);
                    this.drawCurvedTrack();
                    break;
                }
                case trains.play.Direction.LeftDown:
                {
                    this.board.trainContext.translate(0, trains.play.gridSize);
                    this.board.trainContext.rotate(Math.PI * 1.5);
                    this.drawCurvedTrack();
                    break;
                }
                case trains.play.Direction.RightUp:
                {
                    this.board.trainContext.translate(trains.play.gridSize, 0);
                    this.board.trainContext.rotate(Math.PI / 2);
                    this.drawCurvedTrack();
                    break;
                }
                default:
                {
                    this.board.trainContext.rect(0, 0, trains.play.gridSize, trains.play.gridSize);
                    this.board.trainContext.fillStyle = "blue";
                    this.board.trainContext.fill();
                }
            }

            this.board.trainContext.restore();
        }

        private drawStraightTrack(): void {
            var context = this.board.trainContext;

            var thirdGridSize = trains.play.gridSize / 3;

            // draw the track planks
            context.lineWidth = this.trackWidth;
            for (var i = 1; i <= 3; i++) {
                var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
                var yPosition = this.firstTrackPosY - this.trackWidth;

                context.beginPath();
                context.moveTo(xPosition, yPosition);
                context.lineTo(xPosition, this.secondTrackPosY + this.trackWidth);
                context.stroke();
            }

            // draw the white part of the track
            context.beginPath();
            context.clearRect(0, this.firstTrackPosY, trains.play.gridSize, this.trackWidth);
            context.clearRect(0, this.secondTrackPosY - this.trackWidth, trains.play.gridSize, this.trackWidth);

            // draw the outline on the track
            context.beginPath();
            context.lineWidth = 1;

            context.moveTo(0, this.firstTrackPosY);
            context.lineTo(trains.play.gridSize, this.firstTrackPosY);
            context.moveTo(0, this.firstTrackPosY + this.trackWidth);
            context.lineTo(trains.play.gridSize, this.firstTrackPosY + this.trackWidth);

            context.moveTo(0, this.secondTrackPosY - this.trackWidth);
            context.lineTo(trains.play.gridSize, this.secondTrackPosY - this.trackWidth);
            context.moveTo(0, this.secondTrackPosY);
            context.lineTo(trains.play.gridSize, this.secondTrackPosY);

            context.stroke();
        }

        drawCurvedTrack(): void {
            var context = this.board.trainContext;

            context.lineWidth = 1;

            context.beginPath();
            context.arc(0, 0, this.firstTrackPosY, 0, Math.PI / 2, false);
            context.stroke();

            context.beginPath();
            context.arc(0, 0, this.firstTrackPosY + this.trackWidth, 0, Math.PI / 2, false);
            context.stroke();

            context.beginPath();
            context.arc(0, 0, this.secondTrackPosY - this.trackWidth, 0, Math.PI / 2, false);
            context.stroke();

            context.beginPath();
            context.arc(0, 0, this.secondTrackPosY, 0, Math.PI / 2, false);
            context.stroke();

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