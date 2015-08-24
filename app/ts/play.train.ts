/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />

module trains.play {

	export class Train {

		private coords: trains.play.TrainCoords;

		private rotation: number;
		
		private timer: number;

		constructor(private board: trains.play.Board) {

		}

		doChooChoo(): void {
			if (this.board.firstCell !== undefined) {

				this.board.playComponents.$trainCanvas.scroll();
				
				var currentCell = this.board.firstCell;
				
				this.coords = {
					currentX: currentCell.x + (trains.play.gridSize / 2),
					currentY: currentCell.y + (trains.play.gridSize / 2),
					previousX: currentCell.x,
					previousY: currentCell.y-1 //Cos we never want to be the centre of attention
				}
				
				 this.timer = setInterval(() => {
					
					var column = this.board.getGridCoord(this.coords.currentX);
					var row = this.board.getGridCoord(this.coords.currentY);
					
					var cell = this.board.getCell(column, row);
					
					this.coords = cell.getNewCoordsForTrain(this.coords,1.25)
					
					this.draw();
					
				}, 15);
			}
		}
		
		public stop(): void {
			clearInterval(this.timer);
		}
		
		private draw(): void {

			var x = this.coords.currentX;
			var y = this.coords.currentY;
			var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);

			trains.play.BoardRenderer.clearCells(this.board.trainContext, this.board.canvasWidth, this.board.canvasHeight);
			
			var context = this.board.trainContext;
			
			context.save();
			
			context.translate(x,y);
			context.rotate(angle * -1);
			context.fillStyle = "blue";
			context.fillRect(trains.play.gridSize/-4, trains.play.gridSize / -2, trains.play.gridSize/2, trains.play.gridSize);
			
			context.restore();
		}
	}
}