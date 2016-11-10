/// <reference path="play.board.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Loop = (function () {
            function Loop() {
                //To be extended:
                this.targetLoopsPerSecond = 1;
                this.minimumTimeout = 10;
                //Other:
                //TODO: create getters!
                this.loopRunning = false;
                this.lastDuration = 0;
                this.lastStartTime = 0;
                this.averageLoopsPerSecond = 0;
                this.averageLoopsPerSecondSampleSize = 5;
            }
            //TODO: implement strictTiming
            Loop.prototype.startLoop = function () {
                if (this.timeoutId === undefined) {
                    this.loopCallback();
                }
                this.loopRunning = true;
            };
            Loop.prototype.stopLoop = function () {
                this.loopRunning = false;
            };
            Loop.prototype.dispose = function () {
                if (this.timeoutId === undefined) {
                    try {
                        clearTimeout(this.timeoutId);
                    }
                    finally {
                        this.timeoutId = undefined;
                    }
                }
            };
            Loop.prototype.loopCallback = function () {
                var _this = this;
                this.timeoutId = undefined;
                if (this.lastLoopEndTime !== undefined) {
                    this.loopStartTime = new Date().getTime();
                    if (this.lastStartTime === 0) {
                        this.lastStartTime = this.loopStartTime;
                    }
                    if (this.loopRunning) {
                        this.loopBody();
                    }
                    this.lastDuration = new Date().getTime() - this.loopStartTime;
                    if (this.lastStartTime !== undefined) {
                        this.averageLoopsPerSecond = ((this.averageLoopsPerSecond * (this.averageLoopsPerSecondSampleSize - 1)) + (1 / ((this.loopStartTime - this.lastStartTime) / 1000))) / this.averageLoopsPerSecondSampleSize;
                    }
                    this.lastStartTime = this.loopStartTime;
                }
                this.lastLoopEndTime = new Date().getTime();
                this.timeoutId = setTimeout(function () { return _this.loopCallback(); }, Math.max((1000 / this.targetLoopsPerSecond) - this.lastDuration, this.minimumTimeout));
            };
            Loop.prototype.loopBody = function () {
                throw new Error("abstract");
            };
            return Loop;
        })();
        play.Loop = Loop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
