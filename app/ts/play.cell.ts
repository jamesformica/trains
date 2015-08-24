/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />

module trains.play {

    export class Cell {

        public happy: boolean;
        public x: number;
        public y: number;
        public direction: trains.play.Direction;

        constructor(private board: trains.play.Board, public id: string, public column: number, public row: number) {
            this.happy = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.None;
        }

        draw(context: CanvasRenderingContext2D): void {
            context.save();

            context.translate(this.x + 0.5, this.y + 0.5);
            trains.play.CellRenderer.clearCell(context);

            switch (this.direction) {
                case trains.play.Direction.Horizontal:
                    {
                        var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                        break;
                    }
                case trains.play.Direction.Vertical:
                    {
                        var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
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
                case trains.play.Direction.Cross:
                {
                    var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                    trains.play.CellRenderer.drawStraightTrack(context, false,false);
                    context.translate(trains.play.gridSize, 0);
                    context.rotate(Math.PI / 2);
                    trains.play.CellRenderer.drawStraightTrack(context, false,false);
                    break;
                }
            }

            context.restore();
        }

        checkYourself(): void {
            var neighbours = this.board.getNeighbouringCells(this.column, this.row);

            var changed = this.determineDirection(neighbours);
            this.happy = (neighbours.all.length > 1);
            this.draw(this.board.trackContext);

            if (changed) {
                var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                neighbours.all.forEach(n => n.checkYourself());
            }
        }

        determineDirection(neighbours: trains.play.NeighbouringCells): boolean {
            if (this.happy) return false;

            var newDirection: trains.play.Direction;
            if (neighbours.left !== undefined && neighbours.right !== undefined && neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.Cross;
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                newDirection = trains.play.Direction.LeftUp;
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.LeftDown;
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                newDirection = trains.play.Direction.RightUp;
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.RightDown;
            }
            // greedy vertical and horizontal joins    
            else if (neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.Vertical;
            }
            else if (neighbours.left !== undefined && neighbours.right !== undefined) {
                newDirection = trains.play.Direction.Horizontal;
            }
            // now less fussy vertical and horizontal joins    
            else if (neighbours.up !== undefined || neighbours.down !== undefined) {
                newDirection = trains.play.Direction.Vertical;
            }
            else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                newDirection = trains.play.Direction.Horizontal;
            }
            else {
                newDirection = trains.play.Direction.Horizontal;
            }

            if (newDirection !== undefined && newDirection !== this.direction) {
                this.direction = newDirection;
                return true;
            }

            return false;
        }

        isConnectedUp(): boolean {
            return this.direction === Direction.Vertical ||
                this.direction === Direction.LeftUp ||
                this.direction === Direction.RightUp ||
                this.direction === Direction.Cross;
        }

        isConnectedDown(): boolean {
            return this.direction === Direction.Vertical ||
                this.direction === Direction.LeftDown ||
                this.direction === Direction.RightDown||
                this.direction === Direction.Cross;
        }

        isConnectedLeft(): boolean {
            return this.direction === Direction.Horizontal ||
                this.direction === Direction.LeftUp ||
                this.direction === Direction.LeftDown||
                this.direction === Direction.Cross;
        }

        isConnectedRight(): boolean {
            return this.direction === Direction.Horizontal ||
                this.direction === Direction.RightDown ||
                this.direction === Direction.RightUp||
                this.direction === Direction.Cross;
        }

        destroy(): JQueryDeferred<{}> {
            var def = $.Deferred();
            this.destroyLoop(def, 0);

            def.done(() => {
                this.board.trackContext.clearRect(this.x, this.y, trains.play.gridSize, trains.play.gridSize);
            });

            return def;
        }

        destroyLoop(deferred: JQueryDeferred<{}>, counter: number): void {
            setTimeout(() => {
                var x = Math.floor(Math.random() * trains.play.gridSize);
                var y = Math.floor(Math.random() * trains.play.gridSize);

                this.board.trackContext.clearRect(this.x + x, this.y + y, 5, 5);
                counter++;
                if (counter < 40) {
                    this.destroyLoop(deferred, counter);
                } else {
                    deferred.resolve();
                }
            }, 10);
        }

        magicBullshitCompareTo(pen: number, sword: number): number {
            if (pen === sword) return 0;
            if (pen > sword) return -1;
            return 1;
        }

        getNewCoordsForTrain(coords: trains.play.TrainCoords, speed: number): trains.play.TrainCoords {

            if(this.direction === trains.play.Direction.Vertical)
            {
                return {
                    currentX: this.x + (trains.play.gridSize/2),
                    currentY: coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY)),
                    previousX: coords.currentX,
                    previousY: coords.currentY
                };
            }
            else if(this.direction === trains.play.Direction.Horizontal)
            {
                return {
                    currentX: coords.currentX + (speed * this.magicBullshitCompareTo(coords.previousX, coords.currentX)),
                    currentY: this.y + (trains.play.gridSize/2),
                    previousX: coords.currentX,
                    previousY: coords.currentY
                };
            }
            else if(this.direction === trains.play.Direction.Cross)
            {
                var x = (speed * this.magicBullshitCompareTo(coords.previousX, coords.currentX));
                var y = (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));
                return {
                    currentX: (x===0)?this.x + (trains.play.gridSize/2):coords.currentX +x,
                    currentY: (y===0)?this.y + (trains.play.gridSize/2):coords.currentY +y,
                    previousX: coords.currentX,
                    previousY: coords.currentY
                };
            }

            var yOffset = (this.direction === trains.play.Direction.LeftDown || this.direction === trains.play.Direction.RightDown)?yOffset = trains.play.gridSize:0;
            var xOffset = (this.direction === trains.play.Direction.RightUp || this.direction === trains.play.Direction.RightDown)?xOffset = trains.play.gridSize:0;
            var xOffsetFromGrid = (coords.currentX - this.x) - xOffset;
            if(xOffsetFromGrid===0) xOffsetFromGrid+=0.001;
            var yOffsetFromGrid = (coords.currentY - this.y) - yOffset;
            if(yOffsetFromGrid===0) yOffsetFromGrid+=0.001;
            var xOffsetFromGridLast = (coords.previousX - this.x) - xOffset;
            if(xOffsetFromGridLast===0) xOffsetFromGridLast+=0.001;
            var yOffsetFromGridLast = (coords.previousY - this.y) - yOffset;
            if(yOffsetFromGridLast===0) yOffsetFromGridLast+=0.001;

            var angle = Math.atan2(xOffsetFromGrid,yOffsetFromGrid);
            var angleLast = Math.atan2(xOffsetFromGridLast,yOffsetFromGridLast);
            var direction = this.magicBullshitCompareTo(angleLast,angle) * ((Math.abs(angleLast-angle) > Math.PI)?-1:1);
            var angleSpeed = speed/(trains.play.gridSize/2);
            var newAngle = (Math.PI/2)-(angle + (angleSpeed * direction));

            var xOffsetFromGridNew = ((trains.play.gridSize/2)*Math.cos(newAngle)) + xOffset;
            var yOffsetFromGridNew = ((trains.play.gridSize/2)*Math.sin(newAngle)) + yOffset;

            return {
                currentX: this.x + xOffsetFromGridNew,
                currentY: this.y + yOffsetFromGridNew,
                previousX: coords.currentX,
                previousY: coords.currentY
            };
        }
    }

    export interface TrainCoords {
        currentX: number;
        currentY: number;
        previousX: number;
        previousY: number;
    }
}