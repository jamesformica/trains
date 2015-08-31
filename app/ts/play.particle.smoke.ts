/// <reference path="play.board.ts" />
/// <reference path="play.particle.base.ts" />

module trains.play {
    export class ParticleSmoke extends ParticleBase {
        public cloudNumber;
        public cloudSeed;

        constructor() {
            this.cloudNumber = (Math.random() * 5) + 4;
            this.cloudSeed = Math.random() * 10000;

            this.startAlpha = 0.4;
            this.endAlpha = 0.0;
            this.startColorRed = 240;
            this.startColorGreen = 240;
            this.startColorBlue = 240;
            this.endColorRed = 241;
            this.endColorGreen = 241;
            this.endColorBlue = 241;

            this.startAngle = Math.PI * (1.4 * Math.random());
            this.endAngle = Math.PI * (1.4 * Math.random());
            this.startScale = 0.5;
            this.endScale = 1.1;

            this.startVelocity = 0.5;
            this.endVelocity = 0.3;

            super();
        }

        public Update(lifeSteps:number):void {
            super.Update(lifeSteps);
        }

        public Draw(context:CanvasRenderingContext2D):void {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.scale(this.scale, this.scale);
            for (var i = 0; i < (Math.PI * 2); i += ((Math.PI * 2) / this.cloudNumber)) {
                context.beginPath();
                context.fillStyle = this.GetFillStyleAlpha();
                context.arc(5 * Math.cos(i), 5 * Math.sin(i), ((i * this.cloudSeed) % 5) + 3, 0, 2 * Math.PI);
                context.fill();
            }
            context.restore();
        }
    }
}