/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />

module trains.play {

    export class Cell {

        public happy: boolean;
        public x: number;
        public y: number;
        public direction: trains.play.Direction;

        constructor(protected board: trains.play.Board, public id: string, public column: number, public row: number) {
            this.happy = false;
            this.x = this.column * trains.play.gridSize;
            this.y = this.row * trains.play.gridSize;
            this.direction = trains.play.Direction.None;
        }

        draw(context: CanvasRenderingContext2D): void {
            throw new Error("This method is abstract.. no really.. come on.. just pretend! It will be fun I promise.");
        }
                
        turnAroundBrightEyes(): void {
            throw new Error("abstract");
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

        crossTheRoad(): boolean {
            var neighbours = this.board.getNeighbouringCells(this.column, this.row, true);
            
            return neighbours.all.some(c => {
                var myNeighbours = this.board.getNeighbouringCells(c.column, c.row, true);
                if (myNeighbours.all.length < 4) return false;

                if (!myNeighbours.up.isConnectedDown() && myNeighbours.up.happy) return false;
                if (!myNeighbours.down.isConnectedUp() && myNeighbours.down.happy) return false;
                if (!myNeighbours.left.isConnectedRight() && myNeighbours.left.happy) return false;
                if (!myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy) return false;

                // if we got here, we should be a cross                
                c.direction = Direction.Cross;
                c.happy = true;
                c.draw(this.board.trackContext);
                myNeighbours = this.board.getNeighbouringCells(c.column, c.row);
                myNeighbours.all.forEach(c2=> c2.checkYourself());
                
                return true;
            });
        }
        
        determineDirection(neighbours: trains.play.NeighbouringCells): boolean {
            if (this.happy) return false;

            var newDirection: trains.play.Direction;
            if (neighbours.left !== undefined && neighbours.right !== undefined && neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.Cross;
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                if (neighbours.down !== undefined){
                    newDirection = trains.play.Direction.LeftUpLeftDown;
                }
                else{
                    newDirection = trains.play.Direction.LeftUp;
                }              
            }

            else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.LeftDown;
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                if (neighbours.down !== undefined){
                     newDirection = trains.play.Direction.RightDownLeftDown; // last one
                }
                else
                {
                    newDirection = trains.play.Direction.RightUp;    
                }
            }

            else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.RightDown;
            }
            // greedy vertical and horizontal joins    
            else if (neighbours.up !== undefined && neighbours.down !== undefined) {
                newDirection = trains.play.Direction.Vertical;    
            }
            else if (neighbours.left !== undefined && neighbours.right !== undefined) {
                if (neighbours.up !== undefined){
                    newDirection = trains.play.Direction.LeftUpRightUp;
                }
                else if (neighbours.down !== undefined){
                     newDirection = trains.play.Direction.RightDownRightUp; 
                }
                else {
                    newDirection = trains.play.Direction.Horizontal;    
                }
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
    }

    export interface TrainCoords {
        currentX: number;
        currentY: number;
        previousX: number;
        previousY: number;
    }
    
    //Someone please rename this!
    export interface TrainCoordsResult {
        coords: TrainCoords;
        remainingSpeed: number;
    }
}