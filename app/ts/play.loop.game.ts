/// <reference path="play.board.ts" />
/// <reference path="play.baseloop.ts" />

module trains.play {
    export class GameLoop extends Loop {
        constructor(private board: trains.play.Board) {
            super();
            this.targetLoopsPerSecond = 40;
        }
        loopBody(): void {
            var steps = ((this.loopStartTime - this.lastLoopEndTime) / 25);
            if (this.board.trains.length > 0) {
                while (steps > 1) {
                    this.board.trains.forEach(t=> t.chooChooMotherFucker(1));
                    steps--;
                }
                this.board.trains.forEach(t=> t.chooChooMotherFucker(steps));
            }
        }
    }
}