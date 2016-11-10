/// <reference path="play.board.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var ParticleBase = (function () {
            function ParticleBase() {
                this.life = 0;
                this.lifetime = 100;
                this.x = 0;
                this.y = 0;
                this.colorRed = 0;
                this.colorGreen = 0;
                this.colorBlue = 0;
                this.alpha = 1;
                this.scale = 1;
                this.angle = 0;
                this.velocity = 0;
                this.life = 0;
                if (this.startColorRed === undefined)
                    this.startColorRed = 0;
                if (this.startColorGreen === undefined)
                    this.startColorGreen = 0;
                if (this.startColorBlue === undefined)
                    this.startColorBlue = 0;
                if (this.startAlpha === undefined)
                    this.startAlpha = 1;
                if (this.startScale === undefined)
                    this.startScale = 1;
                if (this.startAngle === undefined)
                    this.startAngle = 0;
                if (this.startVelocity === undefined)
                    this.startVelocity = 0;
                if (this.endColorRed === undefined)
                    this.endColorRed = this.startColorRed;
                if (this.endColorGreen === undefined)
                    this.endColorGreen = this.startColorGreen;
                if (this.endColorBlue === undefined)
                    this.endColorBlue = this.startColorBlue;
                if (this.endAlpha === undefined)
                    this.endAlpha = this.startAlpha;
                if (this.endScale === undefined)
                    this.endScale = this.startScale;
                if (this.endAngle === undefined)
                    this.endAngle = this.startAngle;
                if (this.endVelocity === undefined)
                    this.endVelocity = this.startVelocity;
            }
            ParticleBase.prototype.Update = function (lifeSteps) {
                if (this.IsDead()) {
                    return;
                }
                this.life = Math.min(this.life + lifeSteps, this.lifetime);
                this.colorRed = ((this.life / this.lifetime) * (this.endColorRed - this.startColorRed)) + this.startColorRed;
                this.colorGreen = ((this.life / this.lifetime) * (this.endColorGreen - this.startColorGreen)) + this.startColorGreen;
                this.colorBlue = ((this.life / this.lifetime) * (this.endColorBlue - this.startColorBlue)) + this.startColorBlue;
                this.alpha = ((this.life / this.lifetime) * (this.endAlpha - this.startAlpha)) + this.startAlpha;
                this.scale = ((this.life / this.lifetime) * (this.endScale - this.startScale)) + this.startScale;
                this.angle = ((this.life / this.lifetime) * (this.endAngle - this.startAngle)) + this.startAngle;
                this.velocity = ((this.life / this.lifetime) * (this.endVelocity - this.startVelocity)) + this.startVelocity;
                this.x += this.velocity * Math.cos(this.angle);
                this.y += this.velocity * Math.sin(this.angle);
            };
            ParticleBase.prototype.IsDead = function () {
                return (this.life >= this.lifetime);
            };
            ParticleBase.prototype.Draw = function (context) {
                throw new Error("abstract, not the art kind, but the extends kind");
            };
            ParticleBase.prototype.GetFillStyleAlpha = function () {
                return 'rgba(' + Math.round(this.colorRed) + ',' + Math.round(this.colorGreen) + ',' + Math.round(this.colorBlue) + ',' + this.alpha.toFixed(3) + ')';
            };
            return ParticleBase;
        })();
        play.ParticleBase = ParticleBase;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
