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
            if (this.board.trains.length > 0) {
                this.board.trains.forEach(t => {
                    t.draw(this.board.trainContext);
                    if (this.board.selectedTrain === t) {
                        t.draw(this.board.trainLogoContext, false);
                    }
                });
            }
            if (this.board.showDiagnostics === true) {
                this.drawDiagnostics(this.board.trainContext);
            }
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