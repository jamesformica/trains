/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />

module trains.play {

	export class Train {

		private coords: trains.play.TrainCoords;

		private previousAngle: number;
		
		private trainColourIndex: number;

		constructor(private board: trains.play.Board, currentCell: Cell) {
			if (currentCell !== undefined) {
				this.coords = {
					currentX: currentCell.x + (trains.play.gridSize / 2),
					currentY: currentCell.y + (trains.play.gridSize / 2),
					previousX: currentCell.x,
					previousY: currentCell.y-1 //Cos we never want to be the centre of attention
				}
				
				if (Math.floor(Math.random() * 10) === 0) {
					this.trainColourIndex = -1;
				} else {
					this.trainColourIndex = trains.play.TrainRenderer.GetRandomShaftColour();
				}
			}
		}
		
		chooChooMotherFucker(): void {
			try {
				var column = this.board.getGridCoord(this.coords.currentX);
				var row = this.board.getGridCoord(this.coords.currentY);

				var cell = this.board.getCell(column, row);
				if (cell !== undefined) {
					this.coords = cell.getNewCoordsForTrain(this.coords, 1.75)
				}
			}
			catch (e) {
			}
		}
		
		draw(): void {
			var x = this.coords.currentX;
			var y = this.coords.currentY;
			var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);
			
			var context = this.board.trainContext;
			
			this.previousAngle = angle;
			context.save();
			
			context.translate(x,y);
			context.rotate(angle * -1);
			trains.play.TrainRenderer.DrawChoochoo(context, this.trainColourIndex);
			
			context.restore();
		}
		
		isTrainHere(column: number, row: number): boolean {
			var myColumn = this.board.getGridCoord(this.coords.currentX);
			var myRow = this.board.getGridCoord(this.coords.currentY);
			return column === myColumn && row === myRow;
		}
	}
}