/// <reference path="play.board.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.baseloop.ts" />

module trains.play {
    export class RenderLoop extends Loop {
        constructor(private board: trains.play.Board) {
            super();
            this.targetLoopsPerSecond = 30;
        }

        loopBody(): void {
            this.board.trainContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
            this.board.lightingBufferContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);

            //Nighttime Daytime
            //This needs to be moved out into variables
            var diff = ((((new Date().getTime()) - this.board.gameStartTime)/600)+120)%240;
            var r=(diff>=120)?(240-diff):0;
            var g=(diff>=120)?((r/135)*100):0;
            var b=(diff<120)?diff:0;
            var alpha=(diff < 50)?((50-diff)/100):((diff > 190)?((diff-190)/100):0);
            this.board.lightingBufferContext.fillStyle=this.rgbToHex(r,g,b);
            this.board.lightingBufferContext.fillRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
            if (this.board.trains.length > 0) {
                this.board.trains.forEach(t => {
                    t.draw(this.board.trainContext);
                    if(((diff+(t.id/2))<30) || ((diff-(t.id/2))>210)){
                        t.drawLighting(this.board.lightingBufferContext);
                    }
                    if (this.board.selectedTrain === t) {
                        t.draw(this.board.trainLogoContext, false);
                    }
                });
            }

            this.board.trainContext.save();
            this.board.trainContext.globalAlpha = alpha;
            this.board.trainContext.drawImage(this.board.lightingBufferCanvas,0,0);
            this.board.trainContext.restore();
            if (this.board.showDiagnostics === true) {
                this.drawDiagnostics(this.board.trainContext);
            }
        }
        private rgbToHex(r: number, g: number, b: number): string {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        private drawDiagnostics(targetContext: CanvasRenderingContext2D): void {
            targetContext.font = "10px Verdana";
            targetContext.fillText("To render: " + (this.lastDuration.toFixed(2)) + "ms (" + (this.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 10);
            targetContext.fillText("To logic: " + (this.board.gameLoop.lastDuration.toFixed(2)) + "ms (" + (this.board.gameLoop.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 24);
            if (this.board.trains.length > 0) {
                targetContext.fillText("Train Count: " + (this.board.trains.length), 10, 38);
            }
        }
    }
}