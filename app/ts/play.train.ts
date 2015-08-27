/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />
/// <reference path="util.ts" />

module trains.play {

    export class Train {

        private defaultSpeed = 2;

        public coords:trains.play.TrainCoords;

        private trainColourIndex:number;

        public name:string;

        private trainSpeed:number = this.defaultSpeed;

        constructor(public id:number, private board:trains.play.Board, currentCell:Cell) {
            if (currentCell !== undefined) {
                this.coords = {
                    currentX: currentCell.x + (trains.play.gridSize / 2),
                    currentY: currentCell.y + (trains.play.gridSize / 2),
                    previousX: currentCell.x,
                    previousY: currentCell.y - 1 //Cos we never want to be the centre of attention
                };

                if (Math.floor(Math.random() * 10) === 0) {
                    this.trainColourIndex = -1;
                } else {
                    this.trainColourIndex = trains.play.TrainRenderer.GetRandomShaftColour();
                }

                this.name = trains.util.getRandomName();
            }
        }

        public chooChooMotherFucker(speed:number):void {
            if (this.trainSpeed === 0) return;
            speed *= this.trainSpeed;
            while (speed > 0) {
                var column = this.board.getGridCoord(this.coords.currentX);
                var row = this.board.getGridCoord(this.coords.currentY);
                var cell = this.board.getCell(column, row);
                if (cell !== undefined) {
                    var result = this.getNewCoordsForTrain(cell, this.coords, speed);
                    this.coords = result.coords;
                    speed = result.remainingSpeed;
                }
                else break;
            }
            this.wreckYourself();
        }

        public slowYourRoll():void {
            this.trainSpeed--;
            if (this.trainSpeed < 1) {
                this.trainSpeed = 1;
            }
        }

        public fasterFasterFaster():void {
            this.trainSpeed++;
            if (this.trainSpeed > (play.gridSize)) {
                this.trainSpeed = (play.gridSize);
            }
        }

        public hammerTime():void {
            this.trainSpeed = 0;
        }

        public wakeMeUp():void {
            this.trainSpeed = this.defaultSpeed;
        }

        magicBullshitCompareTo(pen:number, sword:number):number {
            if (pen === sword) return 0;
            if (pen > sword) return -1;
            return 1;
        }

        getNewCoordsForTrain(cell:Cell, coords:trains.play.TrainCoords, speed:number):TrainCoordsResult {
            //So, here it goes, some notes on how this all works.
            //This needs a MAJOR rewrite, moving duplicate code out into helpers and refactoring.
            //Also, there are some equations that can be simplified, will slowly fix them up.

            //Start out with a remaningSpeed of 0, this means the movement is contained within this cell
            var remainingSpeed = 0;

            //Lets go vertical
            if (cell.direction === trains.play.Direction.Vertical) {

                //Compare our previous & current Y using magicBullshit to find direction,
                // multiply it by our speed, and add it to our current Y pos to find our biggest move
                var targetY = coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));

                //Check if biggest move is outside of the cell
                if (targetY < cell.y) {

                    //Find how far we move past the cell
                    var additionalTravel = cell.y - targetY;

                    //Using fractions, find out what fraction of the move we can't do, and multiply by speed
                    // This gives us the 'speed' we couldn't use in this cell
                    remainingSpeed = (additionalTravel / (additionalTravel + (coords.currentY - cell.y))) * speed;

                    //Set our new y position to the limit, then add 0.001 (need to make this a const called 'smallStep'
                    // Moving it the extra 0.001 means that the train will be outside this cell, so the next
                    // call to getNewCoords won't be to this cell again.
                    targetY = cell.y - 0.001;

                }
                //Or outside the other side, same as above
                else if (targetY > (cell.y + trains.play.gridSize)) {
                    var additionalTravel = targetY - (cell.y + trains.play.gridSize);
                    remainingSpeed = (additionalTravel / (additionalTravel + ((cell.y + trains.play.gridSize) - coords.currentY))) * speed;
                    targetY = cell.y + trains.play.gridSize + 0.001;
                }

                //Return our payload, the new coords, and if we couldn't use the whole 'speed', what is remaining
                return {
                    coords: {
                        //This is a lovely little fix that re-centre's our train :)
                        currentX: cell.x + (trains.play.gridSize / 2),
                        currentY: targetY,
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: remainingSpeed
                };
            }
            else if (cell.direction === trains.play.Direction.Horizontal) {

                //This is the same as vertical, just modifying X instead.
                var targetX = coords.currentX + (speed * this.magicBullshitCompareTo(coords.previousX, coords.currentX));
                if (targetX < cell.x) {
                    var additionalTravel = cell.x - targetX;
                    remainingSpeed = (additionalTravel / (additionalTravel + (coords.currentX - cell.x))) * speed;
                    targetX = cell.x - 0.001;
                } else if (targetX > (cell.x + trains.play.gridSize)) {
                    var additionalTravel = targetX - (cell.x + trains.play.gridSize);
                    remainingSpeed = (additionalTravel / (additionalTravel + ((cell.x + trains.play.gridSize) - coords.currentX))) * speed;
                    targetX = cell.x + trains.play.gridSize + 0.001;
                }
                return {
                    coords: {
                        currentX: targetX,
                        currentY: cell.y + (trains.play.gridSize / 2),
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: remainingSpeed
                };
            }
            else if (cell.direction === trains.play.Direction.Cross) {

                //Dirty rewrite, but it works, basically the same as horizontal/vertical
                // Find our change in X/Y
                var deltaX = Math.abs(coords.currentX - coords.previousX);
                var deltaY = Math.abs(coords.currentY - coords.previousY);

                //Set our default values to centre the train
                var x = cell.x + (trains.play.gridSize / 2);
                var y = cell.y + (trains.play.gridSize / 2);
                var remainingSpeed = 0;

                //Then use the change in X/Y to calculate if we are vertical or horizontal
                if (deltaX > deltaY) {

                    //This is same as above
                    x = coords.currentX + (speed * this.magicBullshitCompareTo(coords.previousX, coords.currentX));
                    if (x < cell.x) {
                        var additionalTravel = cell.x - x;
                        remainingSpeed = (additionalTravel / (additionalTravel + (coords.currentX - cell.x))) * speed;
                        x = cell.x - 0.001;
                    } else if (x > cell.x + trains.play.gridSize) {
                        var additionalTravel = x - (cell.x + trains.play.gridSize);
                        remainingSpeed = (additionalTravel / (additionalTravel + ((cell.x + trains.play.gridSize) - coords.currentX))) * speed;
                        x = cell.x + trains.play.gridSize + 0.001;
                    }
                }
                else {

                    //Same as above
                    y = coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));
                    if (y < cell.y) {
                        var additionalTravel = cell.y - y;
                        remainingSpeed = (additionalTravel / (additionalTravel + (coords.currentY - cell.y))) * speed;
                        x = cell.y - 0.001;
                    } else if (y > cell.y + trains.play.gridSize) {
                        var additionalTravel = y - (cell.y + trains.play.gridSize);
                        remainingSpeed = (additionalTravel / (additionalTravel + ((cell.x + trains.play.gridSize) - coords.currentY))) * speed;
                        y = cell.y + trains.play.gridSize + 0.001;
                    }
                }
                return {
                    coords: {
                        currentX: x,
                        currentY: y,
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: remainingSpeed
                };
            }
            //Woo! Corner time!
            //Who decided round corners was a good idea :P

            //Calculate X and Y offset based on cell type.
            // Why is this needed? Well, on different corners, the centre of the circle is moved.
            //  For LeftUp, the centre of the circle is 0,0
            //  For LeftDown, the centre of the circle is 0,gridSize
            //  For RightUp, the centre is gridSize,0
            //  For RightDown, the centre is gridSize,gridSize
            var yOffset = (cell.direction === trains.play.Direction.LeftDown || cell.direction === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
            var xOffset = (cell.direction === trains.play.Direction.RightUp || cell.direction === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;

            //We then calculate the current angle.
            // This is done by firstly finding the distance from center circle (using cell position, current position, and offset)
            // We then call zeroIncrement which adds 0.001 to the value if === 0.
            // Read up on acos/asin/atan and x,y=0, we don't want any infinities here!
            // Finally we cheat and use atan2 to find the angle.
            var angle = Math.atan2(this.zeroIncrement((coords.currentX - cell.x) - xOffset), this.zeroIncrement((coords.currentY - cell.y) - yOffset));

            //Same thing again to find the last angle
            var angleLast = Math.atan2(this.zeroIncrement((coords.previousX - cell.x) - xOffset), this.zeroIncrement((coords.previousY - cell.y) - yOffset));

            //Using magicBullshit we find the direction.
            // We then multiply by -1 if the difference between the 2 angles in greater than Math.PI
            // This fixes a strange bug :)
            var direction = this.magicBullshitCompareTo(angleLast, angle) * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);

            //We can then use the fact that (in radians) angle=lengthOfArc/radius to find what angle is needed
            // To move us 'speed' along the arc
            var newAngle = (angle + ((speed / (trains.play.gridSize / 2)) * direction));

            //Using floor (always round down) and (Math.PI/2) (which is 90 degrees), we can find the limits for this track piece
            var angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);

            //Check if we have gone outside lower range
            if (newAngle < angleSector) {

                //Set our new angle to match the minimum
                newAngle = angleSector - 0.001;

                //Using the relationship lengthOfArc=angle*radius, we can use the change in angle to calculate speed
                remainingSpeed = speed-((angle-newAngle)*(trains.play.gridSize / 2));
            }
            //Check if we have gone outside upper range
            else if (newAngle > (angleSector + (Math.PI / 2))) {

                //As above
                newAngle = (angleSector + (Math.PI / 2)) + 0.001;
                remainingSpeed = speed-((angle-newAngle)*(trains.play.gridSize / 2));
            }

            //Add 90 degrees because I abused atan2 in a bad way
            //TODO: fix this plx
            newAngle = (Math.PI / 2) - newAngle;

            //Finally use the radius, angle, and offset to find the new coords
            var xOffsetFromGridNew = ((trains.play.gridSize / 2) * Math.cos(newAngle)) + xOffset;
            var yOffsetFromGridNew = ((trains.play.gridSize / 2) * Math.sin(newAngle)) + yOffset;
            return {
                coords: {
                    currentX: cell.x + xOffsetFromGridNew,
                    currentY: cell.y + yOffsetFromGridNew,
                    previousX: coords.currentX,
                    previousY: coords.currentY
                },
                remainingSpeed: remainingSpeed
            };
        }

        private zeroIncrement(input:number):number {
            return (input === 0) ? input + 0.001 : input;
        }

        public draw(context:CanvasRenderingContext2D, translate:boolean = true):void {
            var x = this.coords.currentX;
            var y = this.coords.currentY;
            var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);

            context.save();

            if (translate) {
                context.translate(x, y);
                context.rotate(angle * -1);
            }
            else {
                context.translate(play.gridSize / 2, play.gridSize / 2);
            }

            trains.play.TrainRenderer.DrawChoochoo(context, this.trainColourIndex);

            context.restore();
        }

        public isTrainHere(column:number, row:number):boolean {
            var myColumn = this.board.getGridCoord(this.coords.currentX);
            var myRow = this.board.getGridCoord(this.coords.currentY);
            return column === myColumn && row === myRow;
        }

        public wreckYourself():boolean {
            return this.board.trains.some(t => t.clashOfTheTitans(t, this));
        }

        public turnTheBeatAround(train1:Train, train2:Train):void {
            var x1 = train1.coords.currentX;
            var y1 = train1.coords.currentY;
            var x2 = train2.coords.currentX;
            var y2 = train2.coords.currentY;

            train1.coords.currentX = train1.coords.previousX;
            train1.coords.currentY = train1.coords.previousY;
            train2.coords.currentX = train2.coords.previousX;
            train2.coords.currentY = train2.coords.previousY;

            train1.coords.previousX = x1;
            train1.coords.previousY = y1;
            train2.coords.previousX = x2;
            train2.coords.previousY = y2;
        }

        public clashOfTheTitans(train1:Train, train2:Train) {
            var myColumn = this.board.getGridCoord(train1.coords.currentX);
            var myRow = this.board.getGridCoord(train1.coords.currentY);

            if (train1 !== train2 && train2.isTrainHere(myColumn, myRow)) {
                if (train1.trainSpeed === train2.trainSpeed) {
                    this.turnTheBeatAround(train2, train1);
                }
                else if (train1.trainSpeed < train2.trainSpeed) {
                    var speedDiff = train2.trainSpeed - train1.trainSpeed
                    this.turnTheBeatAround(train1, train2);

                    if ((train1.trainSpeed + speedDiff) > (play.gridSize / 2)) {
                        train1.trainSpeed = (play.gridSize / 2);
                    }
                    else {
                        train1.trainSpeed += speedDiff;
                    }

                    if ((train2.trainSpeed - speedDiff) < 1) {
                        train2.trainSpeed = 1
                    }
                    else {
                        train2.trainSpeed -= speedDiff;
                    }
                }
                return true;
            }
        }
    }
}