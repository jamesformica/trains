/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />

module trains.play {

    export class Cell {

        public happy: boolean;
        private x: number;
        private y: number;
        public direction: trains.play.Direction;

        constructor(private board: trains.play.Board, public id: number, public column: number, public row: number) {
            this.happy = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.None;
        }

        draw(context: CanvasRenderingContext2D): void {
            context.save();

            context.translate(this.x + 0.5, this.y + 0.5);
            context.clearRect(0, 0, play.gridSize, play.gridSize);

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
            }

            context.restore();
        }

        checkYourself(): void {
            var neighbours = this.board.getNeighbouringCells(this.column, this.row);

            var changed = this.determineDirection(neighbours);
            this.happy = (neighbours.all.length > 1);
            this.draw(this.board.trainContext);

            if (changed) {
                var neighbours = this.board.getNeighbouringCells(this.column, this.row);
                neighbours.all.forEach(n => n.checkYourself());
            }
        }

        determineDirection(neighbours: trains.play.NeighbouringCells): boolean {
            if (this.happy) return false;

            var newDirection: trains.play.Direction;
            if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
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
                this.direction === Direction.RightUp;
        }

        isConnectedDown(): boolean {
            return this.direction === Direction.Vertical ||
                this.direction === Direction.LeftDown ||
                this.direction === Direction.RightDown;
        }

        isConnectedLeft(): boolean {
            return this.direction === Direction.Horizontal ||
                this.direction === Direction.LeftUp ||
                this.direction === Direction.LeftDown;
        }

        isConnectedRight(): boolean {
            return this.direction === Direction.Horizontal ||
                this.direction === Direction.RightDown ||
                this.direction === Direction.RightUp;
        }

        destroy(): JQueryDeferred<{}> {
            var def = $.Deferred();
            this.destroyLoop(def, 0);
            
            def.done(() => {
                this.board.trainContext.clearRect(this.x, this.y, trains.play.gridSize, trains.play.gridSize);
            });
            
            return def;
        }
        
        destroyLoop(deferred: JQueryDeferred<{}>,  counter: number): void {
             setTimeout(() => {
                    var x = Math.floor(Math.random() * trains.play.gridSize);
                    var y = Math.floor(Math.random() * trains.play.gridSize);

                    this.board.trainContext.clearRect(this.x + x, this.y + y, 5, 5);
                    counter++;
                    if (counter < 40) {
                        this.destroyLoop(deferred, counter);
                    } else {
                        deferred.resolve();
                    }
                }, 10);
        }
    }
}