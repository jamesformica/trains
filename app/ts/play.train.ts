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

        private paperRockLizardScissorsSpock:number;
        public trainHP:number;
    
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

                this.paperRockLizardScissorsSpock = Math.floor(Math.random() * 5) + 1;

                this.name = trains.util.getRandomName();
                this.trainHP = 100;
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
            var remainingSpeed = 0;
            if (cell.direction === trains.play.Direction.Vertical) {
                var targetY = coords.currentY + (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));
                if (targetY < cell.y) {
                    var additionalTravel = cell.y - targetY;
                    remainingSpeed = (additionalTravel / (additionalTravel + (coords.currentY - cell.y))) * speed;
                    targetY = cell.y - 0.001;
                } else if (targetY > (cell.y + trains.play.gridSize)) {
                    var additionalTravel = targetY - (cell.y + trains.play.gridSize);
                    remainingSpeed = (additionalTravel / (additionalTravel + ((cell.y + trains.play.gridSize) - coords.currentY))) * speed;
                    targetY = cell.y + trains.play.gridSize + 0.001;
                }
                return {
                    coords: {
                        currentX: cell.x + (trains.play.gridSize / 2),
                        currentY: targetY,
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: remainingSpeed
                };
            }
            else if (cell.direction === trains.play.Direction.Horizontal) {
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
                //REWRITE ALL OF THIS!!!!! There has to be a better way! This does NOT take into account remaining speed!
                var deltaX = Math.abs(coords.currentX - coords.previousX);
                var deltaY = Math.abs(coords.currentY - coords.previousY);
                var x = (speed * this.magicBullshitCompareTo(coords.previousX, coords.currentX));
                var y = (speed * this.magicBullshitCompareTo(coords.previousY, coords.currentY));
                return {
                    coords: {
                        currentX: (deltaX < deltaY) ? cell.x + (trains.play.gridSize / 2) : coords.currentX + x,
                        currentY: (deltaX > deltaY) ? cell.y + (trains.play.gridSize / 2) : coords.currentY + y,
                        previousX: coords.currentX,
                        previousY: coords.currentY
                    },
                    remainingSpeed: 0
                };
            }
            var yOffset = (cell.direction === trains.play.Direction.LeftDown || cell.direction === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
            var xOffset = (cell.direction === trains.play.Direction.RightUp || cell.direction === trains.play.Direction.RightDown) ? trains.play.gridSize : 0;
            var angle = Math.atan2(this.zeroIncrement((coords.currentX - cell.x) - xOffset), this.zeroIncrement((coords.currentY - cell.y) - yOffset));
            var angleLast = Math.atan2(this.zeroIncrement((coords.previousX - cell.x) - xOffset), this.zeroIncrement((coords.previousY - cell.y) - yOffset));
            var direction = this.magicBullshitCompareTo(angleLast, angle) * ((Math.abs(angleLast - angle) > Math.PI) ? -1 : 1);
            var newAngle = (angle + ((speed / (trains.play.gridSize / 2)) * direction));
            var angleSector = Math.floor((angle) / (Math.PI / 2)) * (Math.PI / 2);
            var arcLength = deltaAngle * (trains.play.gridSize / 2);
            if (newAngle < angleSector) {
                var deltaAngle = angleSector - newAngle;
                newAngle = (newAngle + deltaAngle) - 0.001;
                remainingSpeed = (arcLength / (trains.play.gridSize / 2)) * speed;
            }
            else if (newAngle > (angleSector + (Math.PI / 2))) {
                var deltaAngle = newAngle - (angleSector + (Math.PI / 2));
                newAngle = (newAngle - deltaAngle) + 0.001;
                remainingSpeed = (arcLength / (trains.play.gridSize / 2)) * speed;
            }
            newAngle = (Math.PI / 2) - newAngle;
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
        public draw(context: CanvasRenderingContext2D, translate: boolean = true): void {
            var x = this.coords.currentX;
            var y = this.coords.currentY;
            var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);

            context.save();

            if (translate) {
                context.translate(x, y);
                context.rotate(angle * -1);
            }
            else{
                context.translate(play.gridSize / 2, play.gridSize / 2);
            }


            trains.play.TrainRenderer.DrawChoochoo(context, this.trainColourIndex);

            context.restore();
        }

        public isTrainHere(column: number, row: number): boolean {
            var myColumn = this.board.getGridCoord(this.coords.currentX);
            var myRow = this.board.getGridCoord(this.coords.currentY);
            return column === myColumn && row === myRow;
        }

        public wreckYourself(): boolean {

            return this.board.trains.some(t =>t.clashOfTheTitans(t, this));
        }

        public whoIsTheWeakestLink(you: number, me: number): number {
            if (you === me) return 0;

            var isEven = ((you + me) % 2) === 0;
            var youHigher = you > me;

            if (youHigher === isEven) {
                return 1;
            }
            else {
                return 2;
            }
        }

        public turnTheBeatAround(train1: Train, train2: Train): void {
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

        public getRPSLSClass(): string {
            switch (this.paperRockLizardScissorsSpock)
            {
                case 1: {
                    return "fa-hand-rock-o";
                }
                case 2: {
                    return "fa-hand-paper-o";
                }
                case 3: {
                    return "fa-hand-scissors-o";
                }
                case 4: {
                    return "fa-hand-lizard-o";
                }
                case 5: {
                    return "fa-hand-spock-o";
                }
            }
        }

        public clashOfTheTitans(train1: Train, train2: Train)
        {
            var myColumn = this.board.getGridCoord(train1.coords.currentX);
            var myRow = this.board.getGridCoord(train1.coords.currentY);

            if (train1 !== train2 && train2.isTrainHere(myColumn, myRow))
            {
                if (train1.trainSpeed === train2.trainSpeed)
                {
                    this.turnTheBeatAround(train2, train1);
                    return true;
                }
                else if (train1.trainSpeed < train2.trainSpeed)
                {
                    var speedDiff = train2.trainSpeed - train1.trainSpeed
                    this.turnTheBeatAround(train1, train2);

                    if ((train1.trainSpeed + speedDiff ) > (play.gridSize / 2)) {
                        train1.trainSpeed = (play.gridSize / 2);
                    }
                    else{
                        train1.trainSpeed += speedDiff;
                    }

                    if ((train2.trainSpeed - speedDiff) < 1){
                        train2.trainSpeed = 1
                    }
                    else
                    {
                        train2.trainSpeed -= speedDiff;
                    }

                    return true;
                }
            }
        }
    }
}