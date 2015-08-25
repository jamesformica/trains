/// <reference path="play.board.ts" />

module trains.play.TrainRenderer {

	// DRAW ASSUMING TRAIN FACING UP
	var baseColour = "black";
	
	var baseColour = "#cccccc";
	var roofPoke = 2;
	var roofLength = 15;
	
	var shaftColour = "purple";
	var shaftPadding = 4;
	
	var halfGridSize = trains.play.gridSize / 2;
	
	var trainWidth = secondTrackPosY - firstTrackPosY;
	var trainLength = trains.play.gridSize;
	
	var leftX = firstTrackPosY * -1;
	var rightX = secondTrackPosY * -1;
	
	var frontY = halfGridSize * -1;
	var backY = halfGridSize;

	export function DrawChoochoo(context: CanvasRenderingContext2D): void {


		context.fillStyle = baseColour;
		context.fillRect(leftX, frontY, trainWidth, trainLength);
		
		context.fillStyle = shaftColour;
		context.fillRect(leftX + shaftPadding, frontY + shaftPadding, trainWidth - shaftPadding * 2, trainLength);
		
		context.fillStyle = baseColour;
		context.fillRect(leftX - roofPoke, backY - roofLength, trainWidth + roofPoke * 2, roofLength);
		
		

	}

}