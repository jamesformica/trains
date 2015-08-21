/// <reference path="play.board.ts" />

module trains.play.CellRenderer {

    var plankColour = "#382E1C";
    var trackColour = "#6E7587";

    export function clearCell(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, play.gridSize, play.gridSize);
    }
    
    export function drawStraightTrack(context: CanvasRenderingContext2D, cutOffTop: boolean, cutOffBottom: boolean): void {

        var thirdGridSize = trains.play.gridSize / 3;

        // draw the track planks
        context.lineWidth = trackWidth;
        context.strokeStyle = plankColour;
        for (var i = 1; i <= 3; i++) {
            var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
            var yPosition = firstTrackPosY - trackWidth;

            context.beginPath();
            context.moveTo(xPosition, yPosition);
            context.lineTo(xPosition, secondTrackPosY + trackWidth);
            context.stroke();
        }

        var start = cutOffTop ? thirdGridSize - trackWidth : 0;
        var end = trains.play.gridSize - (cutOffBottom ? thirdGridSize - trackWidth : 0);
        
        // this kinda makes sense
        if (cutOffBottom && cutOffTop) {
            end = end - start;
        }
        
        // draw the white part of the track
        context.beginPath();
        context.clearRect(start, firstTrackPosY, end, trackWidth);
        context.clearRect(start, secondTrackPosY - trackWidth, end, trackWidth);

        // I have no idea what I'm doing        
        if (cutOffBottom && cutOffTop) {
            end = end + start;
        }
        
        // draw the outline on the track
        context.lineWidth = 1;
        context.strokeStyle = trackColour;
        context.beginPath();

        context.moveTo(start, firstTrackPosY);
        context.lineTo(end, firstTrackPosY);
        context.moveTo(start, firstTrackPosY + trackWidth);
        context.lineTo(end, firstTrackPosY + trackWidth);

        context.moveTo(start, secondTrackPosY - trackWidth);
        context.lineTo(end, secondTrackPosY - trackWidth);
        context.moveTo(start, secondTrackPosY);
        context.lineTo(end, secondTrackPosY);

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