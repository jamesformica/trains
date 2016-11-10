/// <reference path="play.board.ts" />
/// <reference path="play.baseloop.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.particle.smoke.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var trains;
(function (trains) {
    var play;
    (function (play) {
        var GameLoop = (function (_super) {
            __extends(GameLoop, _super);
            function GameLoop(board) {
                _super.call(this);
                this.board = board;
                this.gameTimeElapsed = 0;
                this.targetLoopsPerSecond = 40;
            }
            GameLoop.prototype.loopBody = function () {
                this.gameTimeElapsed += this.loopStartTime - this.lastStartTime;
                var steps = ((this.loopStartTime - this.lastLoopEndTime) / 25);
                if (this.board.trains.length > 0) {
                    this.board.trains.forEach(function (t) { return t.chooChooMotherFucker(steps); });
                }
                for (var i = 0; i < this.board.smokeParticleSystem.length; i++) {
                    if (this.board.smokeParticleSystem[i].IsDead()) {
                        this.board.smokeParticleSystem.splice(i--, 1);
                    }
                    else {
                        this.board.smokeParticleSystem[i].Update(steps);
                    }
                }
                if (this.board.smokeParticleSystem.length > 0) {
                    this.board.smokeParticleSystem.forEach(function (x) { return x.Update(steps); });
                }
            };
            return GameLoop;
        })(play.Loop);
        play.GameLoop = GameLoop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
