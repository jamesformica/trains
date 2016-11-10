/// <reference path="play.board.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.baseloop.ts" />
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
        var RenderLoop = (function (_super) {
            __extends(RenderLoop, _super);
            function RenderLoop(board) {
                _super.call(this);
                this.board = board;
                //DO NOT CHANGE FROM 240!!!!!!!!
                this.msPerDayCycle = 240;
                this.dayCycleSpeedModifier = 0.6;
                this.dayToNightRatio = 5 / 12; //5 of 12 are night
                this.targetLoopsPerSecond = 30;
            }
            RenderLoop.prototype.loopBody = function () {
                var _this = this;
                this.board.trainContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                this.board.lightingBufferContext.clearRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                //Nighttime Daytime
                var diff = ((this.board.gameLoop.gameTimeElapsed / (1000 * this.dayCycleSpeedModifier)) + (this.msPerDayCycle / 2)) % this.msPerDayCycle;
                if (this.board.cheat_alwaysNight) {
                    diff = 0;
                }
                var r = (diff >= (this.msPerDayCycle / 2)) ? ((this.msPerDayCycle / 2) - diff) : 0;
                var g = (diff >= (this.msPerDayCycle / 2)) ? ((r / 135) * 100) : 0; //135 is magic!
                var b = (diff < (this.msPerDayCycle / 2)) ? diff : 0;
                var alpha = 0;
                if (diff < ((this.dayToNightRatio * this.msPerDayCycle) / 2)) {
                    alpha = ((((this.dayToNightRatio * this.msPerDayCycle) / 2) - diff) / 100);
                }
                else if ((diff > (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2)))) {
                    alpha = ((diff - (this.msPerDayCycle - ((this.dayToNightRatio * this.msPerDayCycle) / 2))) / 100);
                }
                this.board.lightingBufferContext.fillStyle = this.rgbToHex(r, g, b);
                this.board.lightingBufferContext.fillRect(0, 0, this.board.trainCanvas.width, this.board.trainCanvas.height);
                if (this.board.trains.length > 0) {
                    this.board.trains.forEach(function (t) {
                        t.draw(_this.board.trainContext);
                        if (((diff + (t.id / 2)) < 30) || ((diff - (t.id / 2)) > 210)) {
                            t.drawLighting(_this.board.lightingBufferContext);
                        }
                        if (_this.board.selectedTrain === t) {
                            t.draw(_this.board.trainLogoContext, false);
                        }
                    });
                }
                if (this.board.smokeParticleSystem.length > 0) {
                    this.board.smokeParticleSystem.forEach(function (x) { return x.Draw(_this.board.trainContext); });
                }
                this.board.trainContext.save();
                this.board.trainContext.globalAlpha = alpha;
                this.board.trainContext.drawImage(this.board.lightingBufferCanvas, 0, 0);
                this.board.trainContext.restore();
                if (this.board.showDiagnostics === true) {
                    this.drawDiagnostics(this.board.trainContext);
                }
            };
            RenderLoop.prototype.rgbToHex = function (r, g, b) {
                return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            };
            RenderLoop.prototype.drawDiagnostics = function (targetContext) {
                targetContext.font = "10px Verdana";
                targetContext.fillText("To render: " + (this.lastDuration.toFixed(2)) + "ms (" + (this.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 10);
                targetContext.fillText("To logic: " + (this.board.gameLoop.lastDuration.toFixed(2)) + "ms (" + (this.board.gameLoop.averageLoopsPerSecond.toFixed(2)) + "ps)", 10, 24);
                if (this.board.trains.length > 0) {
                    targetContext.fillText("Train Count: " + (this.board.trains.length), 10, 38);
                }
            };
            return RenderLoop;
        })(play.Loop);
        play.RenderLoop = RenderLoop;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
