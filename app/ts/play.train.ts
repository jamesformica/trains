/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />

module trains.play {

	export class Train {

		private coords: trains.play.TrainCoords;

		private rotation: number;

		constructor(private board: trains.play.Board) {

		}

		doChooChoo(): void {
			if (this.board.firstCell !== undefined) {

				this.board.playComponents.$trainCanvas.scroll();
				
				var currentCell = this.board.firstCell;
				
				this.coords = {
					currentX: currentCell.x,
					currentY: currentCell.y + (trains.play.gridSize / 2),
					previousX: -1, 
					previousY: -1
				}
				
				this.coords.previousX = this.coords.currentX - trains.play.gridSize;
				this.coords.previousY = this.coords.currentY;
				
				this.draw(this.coords.currentX, this.coords.currentY);
				
				var timer = setInterval(() => {
					
					var column = this.board.getGridCoord(this.coords.currentX);
					var row = this.board.getGridCoord(this.coords.currentY);
					
					var cell = this.board.getCell(column, row);
					
					this.coords = cell.getNewCoordsForTrain(this.coords)
					
					this.draw(this.coords.currentX, this.coords.currentY);
					
				}, 50);
			}
		}
		
		private draw(x, y): void {
			
			trains.play.BoardRenderer.clearCells(this.board.trainContext, this.board.canvasWidth, this.board.canvasHeight);
			
			var negativeHalfGrid = trains.play.gridSize / -2;
			
			var context = this.board.trainContext;
			
			context.save();
			
			context.translate(x + 0.5, y + 0.5);
			context.fillStyle = "blue";
			context.fillRect(negativeHalfGrid, negativeHalfGrid, trains.play.gridSize, trains.play.gridSize);
			
			context.restore();
		}
	}
}