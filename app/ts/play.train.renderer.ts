/// <reference path="play.board.ts" />

module trains.play.TrainRenderer {
	
	// dark then light
	export var trainColours: Array<Array<string>> = [
		["#7A040B", "#DD2C3E"],			// red
		["#4272DC", "#759cef"],			// blue
		["#2e9b3d", "#66d174"],			// green
		["#44096d", "#8644b5"],			// purple
		["#8644b5", "#f4ef53"]			// yellow
		];
	

	var halfGridSize = trains.play.gridSize / 2;

	var trainWidth = secondTrackPosY - firstTrackPosY;
	var trainLength = trains.play.gridSize;

	var leftX = firstTrackPosY * -1;
	var rightX = leftX + trainWidth;

	var frontY = halfGridSize * -1;
	var backY = halfGridSize;

	// DRAW ASSUMING TRAIN FACING UP
	var baseColour = "#111111";

	var roofPoke = 2;
	var roofWidth = trainWidth + roofPoke * 2;
	var roofLength = 12;
	var roofX = leftX - roofPoke;
	var roofY = backY - roofLength;

	var shaftPadding = 4;
	var shaftWidth = trainWidth - shaftPadding * 2;
	var shaftLength = trainLength - shaftPadding;
	var shaftX = leftX + shaftPadding;
	var shaftY = frontY + shaftPadding;
	
	var bumperPoke = 2;
	var bumperWidth = 1;
	var bumperLength = 3;
	var bumperOffset = 3;

	export function GetRandomShaftColour(): number {
		return Math.floor(Math.random() * trains.play.TrainRenderer.trainColours.length);
	}

	export function DrawChoochoo(context: CanvasRenderingContext2D, shaftColourIndex: number): void {
		
		var shaftColour = trainColours[shaftColourIndex];
		if (shaftColourIndex === -1) {
			shaftColour = trainColours[GetRandomShaftColour()];
		}

		context.fillStyle = baseColour;
		context.fillRect(leftX, frontY, trainWidth, trainLength);

		context.fillStyle = GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
		context.fillRect(shaftX, shaftY, shaftWidth, shaftLength);

		context.fillStyle = GetRoofFillStyle(context, baseColour, "#5d5d5d");
		context.fillRect(roofX, roofY, roofWidth, roofLength);
		context.strokeRect(roofX, roofY, roofWidth, roofLength);

		context.fillStyle = baseColour;
		context.beginPath();
		context.arc(shaftX + (shaftWidth / 2), shaftY + 6, 2, 0, 2 * Math.PI);
		context.stroke();
		context.closePath;
		context.fill();
		
		DrawBumpers(context, true);
		DrawBumpers(context, false);
	}

	function GetRoofFillStyle(context: CanvasRenderingContext2D, firstColour: string, secondColour: string): CanvasGradient {
		var x2 = roofX + roofWidth;

		var grd = context.createLinearGradient(roofX, roofY, x2, roofY);
		grd.addColorStop(0, firstColour);
		grd.addColorStop(0.5, secondColour);
		grd.addColorStop(1, firstColour);
		return grd;
	}

	function GetShaftFillStyle(context: CanvasRenderingContext2D, firstColour: string, secondColour: string): CanvasGradient {
		var x2 = shaftX + shaftWidth;

		var grd = context.createLinearGradient(shaftX, shaftY, x2, shaftY);
		grd.addColorStop(0, firstColour);
		grd.addColorStop(0.5, secondColour)
		grd.addColorStop(1, firstColour);
		return grd;
	}
	
	function DrawBumpers(context: CanvasRenderingContext2D, upFront: boolean): void {
		
		var y: number;
		var bumperY: number;
		if (upFront) {
			y = frontY;
			bumperY = frontY - bumperPoke;
		} else {
			y = backY;
			bumperY = backY + bumperPoke
		}
		
		context.beginPath();
		context.lineWidth = bumperWidth;
		context.strokeStyle = baseColour;
		
		context.moveTo(leftX + bumperOffset, bumperY);
		context.lineTo(leftX + bumperOffset, y);
		context.moveTo(leftX + bumperOffset - (bumperLength / 2), bumperY);
		context.lineTo(leftX + bumperOffset + (bumperLength / 2), bumperY);
		
		context.moveTo(rightX - bumperOffset, bumperY);
		context.lineTo(rightX - bumperOffset, y);
		context.moveTo(rightX - bumperOffset - (bumperLength / 2), bumperY);
		context.lineTo(rightX - bumperOffset + (bumperLength / 2), bumperY);
		
		context.stroke();	
	}
}