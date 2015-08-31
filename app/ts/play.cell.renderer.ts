/// <reference path="play.board.ts" />

module trains.play.CellRenderer {

    var plankColour = "#382E1C";
    var trackColour = "#6E7587";

    export function clearCell(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, play.gridSize, play.gridSize);
    }

    export function drawStraightTrack(context: CanvasRenderingContext2D, cutOffTop: boolean, cutOffBottom: boolean): void {

        var numPlanks = 3;
        var startX = 0;
        var endX = trains.play.gridSize;
        var thirdGridSize = trains.play.gridSize / 3;

        // draw the track planks
        context.lineWidth = trackWidth;
        context.strokeStyle = plankColour;
        context.beginPath();
        for (var i = 1; i <= numPlanks; i++) {
            var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
            var yPosition = firstTrackPosY - trackWidth;

            context.moveTo(xPosition, yPosition);
            context.lineTo(xPosition, secondTrackPosY + trackWidth);

            if (cutOffTop && i === 1) {
                startX = xPosition + trackWidth - 1;        // why -1? cause canvas thats why
            } else if (cutOffBottom && i === numPlanks) {
                endX = xPosition - 1;                       // why -1? cause canvas thats why
            }
        }
        context.stroke();
        
        // draw the white part of the track
        var endWidth = endX - startX;
        context.beginPath();
        context.clearRect(startX, firstTrackPosY, endWidth, trackWidth);
        context.clearRect(startX, secondTrackPosY - trackWidth, endWidth, trackWidth);
        
        // draw the outline on the track
        context.lineWidth = 1;
        context.strokeStyle = trackColour;
        context.beginPath();

        context.moveTo(startX, firstTrackPosY);
        context.lineTo(endX, firstTrackPosY);
        context.moveTo(startX, firstTrackPosY + trackWidth);
        context.lineTo(endX, firstTrackPosY + trackWidth);

        context.moveTo(startX, secondTrackPosY - trackWidth);
        context.lineTo(endX, secondTrackPosY - trackWidth);
        context.moveTo(startX, secondTrackPosY);
        context.lineTo(endX, secondTrackPosY);

        context.stroke();
    }

    export function drawCurvedTrack(context: CanvasRenderingContext2D): void {


        drawCurvedPlank(context, 20 * Math.PI / 180);
        drawCurvedPlank(context, 45 * Math.PI / 180);

        drawCurvedPlank(context, 70 * Math.PI / 180);

        context.lineWidth = 1;
        context.strokeStyle = trackColour;

        var finishAngle = Math.PI / 2;

        context.beginPath();
        context.arc(0, 0, firstTrackPosY, 0, finishAngle, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, firstTrackPosY + trackWidth, 0, finishAngle, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, secondTrackPosY - trackWidth, 0, finishAngle, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, secondTrackPosY, 0, finishAngle, false);
        context.stroke();

    }

    export function drawCurvedPlank(context: CanvasRenderingContext2D, basePos: number): void {

        var cos = Math.cos(basePos);
        var sin = Math.sin(basePos);

        context.lineWidth = trackWidth;
        context.strokeStyle = plankColour;

        context.beginPath();

        context.moveTo((firstTrackPosY - trackWidth) * cos, (firstTrackPosY - trackWidth) * sin);
        context.lineTo((firstTrackPosY) * cos, (firstTrackPosY) * sin);

        context.moveTo((firstTrackPosY + trackWidth) * cos, (firstTrackPosY + trackWidth) * sin);
        context.lineTo((secondTrackPosY - trackWidth) * cos, (secondTrackPosY - trackWidth) * sin);

        context.moveTo((secondTrackPosY) * cos, (secondTrackPosY) * sin);
        context.lineTo((secondTrackPosY + trackWidth) * cos, (secondTrackPosY + trackWidth) * sin);
        context.stroke();
    }

}