/// <reference path="play.board.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.baseloop.ts" />

module trains.play {
    export class RenderLoop extends Loop {
        constructor(private board:trains.play.Board) {
            super();
            this.targetLoopsPerSecond = 30;
        }

        //DO NOT CHANGE FROM 240!!!!!!!!
        private msPerDayCycle = 240;
        private dayCycleSpeedModifier = 0.6;
        private dayToNightRatio = 5 / 12; //5 of 12 are night

        loopBody():void {
            this.board.trainContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
            this.board.lightingBufferContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);

            //Nighttime Daytime
            var diff = ((this.board.gameLoop.gameTimeElapsed / (1000 * this.dayCycleSpeedModifier)) + (this.msPerDayCycle / 2)) % this.msPerDayCycle;
            var r = (diff >= (this.msPerDayCycle / 2)) ? ((this.msPerDayCycle / 2) - diff) : 0;
            var g = (diff >= (this.msPerDayCycle / 2)) ? ((r / 135) * 100) : 0; //135 is magic!
            var b = (diff < (this.msPerDayCycle / 2)) ? diff : 0;
            var alpha = 0;
            if (diff < ((this.dayToNightRatio * this.msPerDayCycle) / 2)) {
                alpha = ((((this.dayToNightRatio * this.msPerDayCycle) / 2) - diff) / 100);
            } else if ((diff > (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2)))) {
                alpha = ((diff - (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2))) / 100);
            }
            this.board.lightingBufferContext.fillStyle = this.rgbToHex(r, g, b);
            this.board.lightingBufferContext.fillRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);

            if (this.board.trains.length > 0) {
                this.board.trains.forEach(t => {
                    t.draw(this.board.trainContext);
                    if (((diff + (t.id / 2)) < 30) || ((diff - (t.id / 2)) > 210)) {
                        t.drawLighting(this.board.lightingBufferContext);
                    }
                    if (this.board.selectedTrain === t) {
                        t.draw(this.board.trainLogoContext, false);
                    }
                });
            }

            this.board.trainContext.save();
            this.board.trainContext.globalAlpha = alpha;
            this.board.trainContext.drawImage(this.board.lightingBufferCanvas, 0, 0);
            this.board.trainContext.restore();
            if (this.board.showDiagnostics === true) {
                this.drawDiagnostics(this.board.trainContext);
            }
        }

        private rgbToHex(r:number, g:number, b:number):string {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        private drawDiagnostics(targetContext:CanvasRenderingContext2D):void {
            targetContext.font = "10px Verdana";
            targetContext.fillText("To render: " + (this.lastDuration.toFixed(2)) + "ms (" + (this.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 10);
            targetContext.fillText("To logic: " + (this.board.gameLoop.lastDuration.toFixed(2)) + "ms (" + (this.board.gameLoop.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 24);
            if (this.board.trains.length > 0) {
                targetContext.fillText("Train Count: " + (this.board.trains.length), 10, 38);
            }
        }
    }
}