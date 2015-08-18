/// <reference path="play.board.ts" />

module trains.play.CellRenderer {

    export function drawStraightTrack(context: CanvasRenderingContext2D): void {

        var thirdGridSize = trains.play.gridSize / 3;

        // draw the track planks
        context.lineWidth = trackWidth;
        for (var i = 1; i <= 3; i++) {
            var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
            var yPosition = firstTrackPosY - trackWidth;

            context.beginPath();
            context.moveTo(xPosition, yPosition);
            context.lineTo(xPosition, secondTrackPosY + trackWidth);
            context.stroke();
        }

        // draw the white part of the track
        context.beginPath();
        context.clearRect(0, firstTrackPosY, trains.play.gridSize, trackWidth);
        context.clearRect(0, secondTrackPosY - trackWidth, trains.play.gridSize, trackWidth);

        // draw the outline on the track
        context.lineWidth = 1;
        context.beginPath();

        context.moveTo(0, firstTrackPosY);
        context.lineTo(trains.play.gridSize, firstTrackPosY);
        context.moveTo(0, firstTrackPosY + trackWidth);
        context.lineTo(trains.play.gridSize, firstTrackPosY + trackWidth);

        context.moveTo(0, secondTrackPosY - trackWidth);
        context.lineTo(trains.play.gridSize, secondTrackPosY - trackWidth);
        context.moveTo(0, secondTrackPosY);
        context.lineTo(trains.play.gridSize, secondTrackPosY);

        context.stroke();
    }

    export function drawCurvedTrack(context: CanvasRenderingContext2D): void {

        drawCurvedPlank(context, 20 * Math.PI / 180);
        drawCurvedPlank(context, 70 * Math.PI / 180);
        drawCurvedPlank(context, 45 * Math.PI / 180);

        context.lineWidth = 1;

        context.beginPath();
        context.arc(0, 0, firstTrackPosY, 0, Math.PI / 2, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, firstTrackPosY + trackWidth, 0, Math.PI / 2, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, secondTrackPosY - trackWidth, 0, Math.PI / 2, false);
        context.stroke();

        context.beginPath();
        context.arc(0, 0, secondTrackPosY, 0, Math.PI / 2, false);
        context.stroke();

    }

    export function drawCurvedPlank(context: CanvasRenderingContext2D, basePos: number): void {

        var cos = Math.cos(basePos);
        var sin = Math.sin(basePos);

        context.lineWidth = trackWidth;

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