/// <reference path="play.board.ts" />

module trains.play {
    export class ParticleBase {
        public life:number = 0;
        public lifetime:number = 100;

        public startColorRed:number;
        public startColorGreen:number;
        public startColorBlue:number;
        public startAlpha:number;
        public startScale:number;
        public startAngle:number;
        public startVelocity:number;

        public endColorRed:number;
        public endColorGreen:number;
        public endColorBlue:number;
        public endAlpha:number;
        public endScale:number;
        public endAngle:number;
        public endVelocity:number;

        public x:number = 0;
        public y:number = 0;
        public colorRed:number = 0;
        public colorGreen:number = 0;
        public colorBlue:number = 0;
        public alpha:number = 1;
        public scale:number = 1;
        public angle:number = 0;
        public velocity:number = 0;

        constructor() {
            this.life = 0;
            if (this.startColorRed === undefined) this.startColorRed = 0;
            if (this.startColorGreen === undefined) this.startColorGreen = 0;
            if (this.startColorBlue === undefined) this.startColorBlue = 0;
            if (this.startAlpha === undefined) this.startAlpha = 1;
            if (this.startScale === undefined) this.startScale = 1;
            if (this.startAngle === undefined) this.startAngle = 0;
            if (this.startVelocity === undefined) this.startVelocity = 0;
            if (this.endColorRed === undefined) this.endColorRed = this.startColorRed;
            if (this.endColorGreen === undefined) this.endColorGreen = this.startColorGreen;
            if (this.endColorBlue === undefined) this.endColorBlue = this.startColorBlue;
            if (this.endAlpha === undefined) this.endAlpha = this.startAlpha;
            if (this.endScale === undefined) this.endScale = this.startScale;
            if (this.endAngle === undefined) this.endAngle = this.startAngle;
            if (this.endVelocity === undefined) this.endVelocity = this.startVelocity;
        }

        public Update(lifeSteps:number):void {
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
        }

        public IsDead():boolean {
            return (this.life >= this.lifetime);
        }

        public Draw(context:CanvasRenderingContext2D):void {
            throw new Error("abstract, not the art kind, but the extends kind");
        }

        public GetFillStyleAlpha():string {
            return 'rgba(' + Math.round(this.colorRed) + ',' + Math.round(this.colorGreen) + ',' + Math.round(this.colorBlue) + ',' + this.alpha.toFixed(3) + ')';
        }
    }
}