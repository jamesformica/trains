/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />

module trains.play {

	export class Train {

		private coords: trains.play.TrainCoords;

		private previousAngle: number;        
		private rotation: number;
		
		private timer: number;

		constructor(private board: trains.play.Board, currentCell: Cell) {
			if (currentCell !== undefined) {
				this.coords = {
					currentX: currentCell.x + (trains.play.gridSize / 2),
					currentY: currentCell.y + (trains.play.gridSize / 2),
					previousX: currentCell.x,
					previousY: currentCell.y-1 //Cos we never want to be the centre of attention
				}
				
				this.start();
			}
		}
		
		public chooChooMotherFucker(): void {
			var column = this.board.getGridCoord(this.coords.currentX);
			var row = this.board.getGridCoord(this.coords.currentY);
			
			var cell = this.board.getCell(column, row);
			
			this.coords = cell.getNewCoordsForTrain(this.coords,1.25)
			
			this.draw();
		}
		
		public start(): void {
			if (this.timer === undefined) {
				this.timer = setInterval(() => { this.chooChooMotherFucker(); }, 15);
			}    
		}
		
		public stop(): void {
			clearInterval(this.timer);
			this.timer = undefined;
		}
		
		private draw(): void {
			var x = this.coords.currentX;
			var y = this.coords.currentY;
			var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);
			
			var context = this.board.trainContext;
			

			if (this.previousAngle !== undefined) {
				context.save();
				context.translate(this.coords.previousX, this.coords.previousY);
				context.rotate(this.previousAngle * -1);
				context.clearRect(trains.play.gridSize / -4, trains.play.gridSize / -2, trains.play.gridSize / 2, trains.play.gridSize);	
				context.restore();
			}
			
			this.previousAngle = angle;
			context.save();
			
			context.translate(x,y);
			context.rotate(angle * -1);
			context.fillStyle = "blue";
			context.fillRect(trains.play.gridSize/-4, trains.play.gridSize / -2, trains.play.gridSize/2, trains.play.gridSize);
			
			context.restore();
		}
	}
}