/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />
/// <reference path="util.ts" />
/// <reference path="play.trainCarriage.ts" />

module trains.play {

    export class Train {

        public defaultSpeed = 2;

        public coords:trains.play.TrainCoords;

        public trainColourIndex:number;

        public name:string;

        public trainSpeed:number = this.defaultSpeed;
        public imageReverse:number = 1;

        public carriage:trains.play.TrainCarriage;

        public carriagePadding:number = 5;

        public nextSmoke = 0;

        constructor(public id:number, cell:Cell) {
            if (cell !== undefined) {
                this.coords = {
                    currentX: cell.x + (trains.play.gridSize / 2),
                    currentY: cell.y + (trains.play.gridSize / 2),
                    previousX: cell.x,
                    previousY: cell.y - 1 //Cos we never want to be the centre of attention
                };

                if (Math.floor(Math.random() * 10) === 0) {
                    this.trainColourIndex = -1;
                } else {
                    this.trainColourIndex = trains.play.TrainRenderer.GetRandomShaftColour();
                }

                this.name = trains.util.getRandomName();
            }
        }

        public spawnCarriage():void
        {
            if(this.carriage !== undefined) {
                this.carriage.spawnCarriage();
            }else {
                this.carriage = new TrainCarriage(-1, undefined);
                this.carriage.coords = {
                    currentX: this.coords.currentX,
                    currentY: this.coords.currentY,
                    previousX: this.coords.currentX + (-10 * this.magicBullshitCompareTo(this.coords.currentX, this.coords.previousX)),
                    previousY: this.coords.currentY + (-10 * this.magicBullshitCompareTo(this.coords.currentY, this.coords.previousY))
                    };
                this.carriage.trainColourIndex = this.trainColourIndex;
                this.carriage.chooChooMotherFucker(this.carriagePadding + (trains.play.gridSize/2),false);
                this.carriage.coords.previousX = this.carriage.coords.currentX + (-10 * this.magicBullshitCompareTo(this.carriage.coords.currentX, this.carriage.coords.previousX));
                this.carriage.coords.previousY = this.carriage.coords.currentY + (-10 * this.magicBullshitCompareTo(this.carriage.coords.currentY, this.carriage.coords.previousY));
            }
        }

        public chooChooMotherFucker(speed:number, checkCollision:boolean = true):void {
            if (this.trainSpeed === 0) return;
            var baseSpeed = speed;
            speed *= this.trainSpeed;
            //Super small speeds cause MAJOR problems with the game loop.
            // First occurrence of this bug, speed was 1.13e-14!!!!!
            while (Math.abs(speed)>0.00001) {
                var column = GameBoard.getGridCoord(this.coords.currentX);
                var row = GameBoard.getGridCoord(this.coords.currentY);
                var cell = GameBoard.getCell(column, row);
                if (cell !== undefined) {
                    var result = this.getNewCoordsForTrain(cell, this.coords, speed);
                    this.coords = result.coords;
                    speed = result.remainingSpeed;
                }
                else{
                    break;
                }
            }
            if(this.carriage!==undefined){
                this.carriage.trainSpeed = this.trainSpeed;
                this.carriage.chooChooMotherFucker(baseSpeed, false);
            }
            if(checkCollision) {
                this.wreckYourself();
            }
            if(checkCollision &&(this.nextSmoke < GameBoard.gameLoop.gameTimeElapsed)){
                var p = new ParticleSmoke();
                p.x = this.coords.currentX;
                p.y = this.coords.currentY;
                GameBoard.smokeParticleSystem.push(p);
                this.nextSmoke = GameBoard.gameLoop.gameTimeElapsed + (Math.random()*125) + 475;
            }
        }

        public slowYourRoll():void {
            this.trainSpeed--;
            if (this.trainSpeed < (-1*play.gridSize)) {
                this.trainSpeed = (-1*play.gridSize);
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

            //Start out with a remainingSpeed of 0, this means the movement is contained within this cell
            var remainingSpeed = 0;

            //Lets go vertical
            if (cell.direction === trains.play.Direction.Vertical) {

                //Compare our previous & current Y using magicBullshit to find direction,
                // multiply it by our speed, and add it to our current Y pos to find our biggest move
                var targetY = coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));

                //Check if biggest move is outside of the cell
                if (targetY < cell.y) {
                    //Set our new y position to the limit, then add 0.001 (need to make this a const called 'smallStep'
                    // Moving it the extra 0.001 means that the train will be outside this cell, so the next
                    // call to getNewCoords won't be to this cell again.
                    targetY = cell.y - 0.001;
                }
                //Or outside the other side, same as above
                else if (targetY > (cell.y + trains.play.gridSize)) {
                    targetY = cell.y + trains.play.gridSize + 0.001;
                }

                //Set out remaining 'speed' to be our speed minus what we used
                remainingSpeed = speed + (((speed>0)?-1:1)* Math.abs(coords.currentY-targetY));

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
                    targetX = cell.x - 0.001;
                } else if (targetX > (cell.x + trains.play.gridSize)) {
                    targetX = cell.x + trains.play.gridSize + 0.001;
                }
                remainingSpeed = speed + (((speed>0)?-1:1)* Math.abs(coords.currentX-targetX));
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
                        x = cell.x - 0.001;
                    } else if (x > cell.x + trains.play.gridSize) {
                        x = cell.x + trains.play.gridSize + 0.001;
                    }

                    remainingSpeed = speed + (((speed>0)?-1:1)* Math.abs(coords.currentX-x));;
                }
                else {

                    //Same as above
                    y = coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));
                    if (y < cell.y) {
                        y = cell.y - 0.001;
                    } else if (y > cell.y + trains.play.gridSize) {
                        y = cell.y + trains.play.gridSize + 0.001;
                    }
                    remainingSpeed = speed + (((speed>0)?-1:1)* Math.abs(coords.currentY-y));
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
            var angle = Math.atan2(this.zeroIncrement((coords.currentY - cell.y) - yOffset),this.zeroIncrement((coords.currentX - cell.x) - xOffset));

            //Same thing again to find the last angle
            var angleLast = Math.atan2(this.zeroIncrement((coords.previousY - cell.y) - yOffset),this.zeroIncrement((coords.previousX - cell.x) - xOffset));

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
                newAngle = angleSector - 0.001;
            }
            //Check if we have gone outside upper range
            else if (newAngle > (angleSector + (Math.PI / 2))) {
                newAngle = (angleSector + (Math.PI / 2)) + 0.001;
            }
            //Using the relationship lengthOfArc=angle*radius, we can use the change in angle to calculate speed
            remainingSpeed = speed + (((speed>=0)?-1:1)*(Math.abs(angle-newAngle)*(trains.play.gridSize / 2)));

            //Add 90 degrees because I abused atan2 in a bad way
            //TODO: fix this plx
            //newAngle = (Math.PI / 2) - newAngle;

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
                context.rotate((angle * -1) +((this.imageReverse<0)?Math.PI:0));
            }
            else {
                context.translate(play.gridSize / 2, play.gridSize / 2);
            }

            trains.play.TrainRenderer.DrawChoochoo(context, this.trainColourIndex);

            context.restore();

            if((this.carriage !== undefined)&&translate)
            {
                this.carriage.draw(context,translate);
                this.drawLink(context);
            }
        }

        public drawLighting(context:CanvasRenderingContext2D):void {
            var x = this.coords.currentX;
            var y = this.coords.currentY;
            var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);
            context.save();
            context.translate(x, y);
            context.rotate((angle * -1) +((this.imageReverse<0)?Math.PI:0));
            trains.play.TrainRenderer.DrawChoochooLights(context);
            context.restore();
        }

        public isTrainHere(column:number, row:number):boolean {
            var myColumn = GameBoard.getGridCoord(this.coords.currentX);
            var myRow = GameBoard.getGridCoord(this.coords.currentY);
            if(this.carriage !== undefined) {
                return ((column === myColumn && row === myRow) || this.carriage.isTrainHere(column,row));
            }else{
                return column === myColumn && row === myRow;
            }
        }

        public wreckYourself():boolean {
            return GameBoard.trains.some(t => t.clashOfTheTitans(t, this));
        }
        public drawLink(context:CanvasRenderingContext2D):void{
            var sp1 = (trains.play.gridSize/2)/Math.sqrt(Math.pow(this.coords.currentX-this.coords.previousX,2)+Math.pow(this.coords.currentY-this.coords.previousY,2));
            var x1 = this.coords.currentX - ((this.coords.currentX-this.coords.previousX)*sp1*this.imageReverse);
            var y1 = this.coords.currentY - ((this.coords.currentY-this.coords.previousY)*sp1*this.imageReverse);

            var sp2 =(trains.play.gridSize/2)/Math.sqrt(Math.pow(this.carriage.coords.currentX-this.carriage.coords.previousX,2)+Math.pow(this.carriage.coords.currentY-this.carriage.coords.previousY,2));
            var x2 = this.carriage.coords.currentX + ((this.carriage.coords.currentX-this.carriage.coords.previousX)*sp2*this.imageReverse);
            var y2 = this.carriage.coords.currentY + ((this.carriage.coords.currentY-this.carriage.coords.previousY)*sp2*this.imageReverse);


            context.save();
            context.lineWidth = 3;
            context.strokeStyle = "#454545";
            context.beginPath();

            context.moveTo(x1, y1);
            context.lineTo(x2, y2);

            context.stroke();
            context.restore();
        }

        public turnTheBeatAround(): void {
            var x1 = this.coords.currentX;
            var y1 = this.coords.currentY;

            this.coords.currentX = this.coords.previousX;
            this.coords.currentY = this.coords.previousY;

            this.coords.previousX = x1;
            this.coords.previousY = y1;
            //Woo!
            this.imageReverse *= -1;
            if(this.carriage !== undefined)
            {
                this.carriage.turnTheBeatAround();
            }
        }

        public clashOfTheTitans(train1:Train, train2:Train) {
            var myColumn = GameBoard.getGridCoord(train1.coords.currentX);
            var myRow = GameBoard.getGridCoord(train1.coords.currentY);

            if (train1 !== train2 && train2.isTrainHere(myColumn, myRow)) {
                if (train1.trainSpeed === train2.trainSpeed) {
                    
                    train2.turnTheBeatAround();
                    train1.turnTheBeatAround();
                    return true;
                }
                else if (train1.trainSpeed < train2.trainSpeed) {
                    var speedDiff = train2.trainSpeed - train1.trainSpeed
                    train1.turnTheBeatAround();
                    train2.turnTheBeatAround();

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