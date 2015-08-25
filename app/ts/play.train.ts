/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="play.train.renderer.ts" />

module trains.play {

	export class Train {

		private coords: trains.play.TrainCoords;

		private previousAngle: number;
		
		// alex was here

		constructor(private board: trains.play.Board, currentCell: Cell) {
			if (currentCell !== undefined) {
				this.coords = {
					currentX: currentCell.x + (trains.play.gridSize / 2),
					currentY: currentCell.y + (trains.play.gridSize / 2),
					previousX: currentCell.x,
					previousY: currentCell.y-1 //Cos we never want to be the centre of attention
				}
			}
		}
		
		public chooChooMotherFucker(): void {
			try {
				var column = this.board.getGridCoord(this.coords.currentX);
				var row = this.board.getGridCoord(this.coords.currentY);

				var cell = this.board.getCell(column, row);
				if (cell !== undefined) {
					this.coords = cell.getNewCoordsForTrain(this.coords, 1.25)
				}
			}
			catch (e) {
			}
		}
		
		public draw(): void {
			var x = this.coords.currentX;
			var y = this.coords.currentY;
			var angle = Math.atan2(this.coords.previousX - x, this.coords.previousY - y);
			
			var context = this.board.trainContext;
			
			this.previousAngle = angle;
			context.save();
			
			context.translate(x,y);
			context.rotate(angle * -1);
			trains.play.TrainRenderer.DrawChoochoo(context);
			
			context.restore();
		}
	}
}