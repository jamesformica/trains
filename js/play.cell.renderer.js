/// <reference path="play.board.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var CellRenderer;
        (function (CellRenderer) {
            var plankColour = "#382E1C";
            var trackColour = "#6E7587";
            function clearCell(context) {
                context.clearRect(0, 0, play.gridSize, play.gridSize);
            }
            CellRenderer.clearCell = clearCell;
            function drawStraightTrack(context, cutOffTop, cutOffBottom) {
                var numPlanks = 3;
                var startX = 0;
                var endX = trains.play.gridSize;
                var thirdGridSize = trains.play.gridSize / 3;
                // draw the track planks
                context.lineWidth = play.trackWidth;
                context.strokeStyle = plankColour;
                context.beginPath();
                for (var i = 1; i <= numPlanks; i++) {
                    var xPosition = (thirdGridSize * i) - (thirdGridSize / 2);
                    var yPosition = play.firstTrackPosY - play.trackWidth;
                    context.moveTo(xPosition, yPosition);
                    context.lineTo(xPosition, play.secondTrackPosY + play.trackWidth);
                    if (cutOffTop && i === 1) {
                        startX = xPosition + play.trackWidth - 1; // why -1? cause canvas thats why
                    }
                    else if (cutOffBottom && i === numPlanks) {
                        endX = xPosition - 1; // why -1? cause canvas thats why
                    }
                }
                context.stroke();
                // draw the white part of the track
                var endWidth = endX - startX;
                context.beginPath();
                context.clearRect(startX, play.firstTrackPosY, endWidth, play.trackWidth);
                context.clearRect(startX, play.secondTrackPosY - play.trackWidth, endWidth, play.trackWidth);
                // draw the outline on the track
                context.lineWidth = 1;
                context.strokeStyle = trackColour;
                context.beginPath();
                context.moveTo(startX, play.firstTrackPosY);
                context.lineTo(endX, play.firstTrackPosY);
                context.moveTo(startX, play.firstTrackPosY + play.trackWidth);
                context.lineTo(endX, play.firstTrackPosY + play.trackWidth);
                context.moveTo(startX, play.secondTrackPosY - play.trackWidth);
                context.lineTo(endX, play.secondTrackPosY - play.trackWidth);
                context.moveTo(startX, play.secondTrackPosY);
                context.lineTo(endX, play.secondTrackPosY);
                context.stroke();
            }
            CellRenderer.drawStraightTrack = drawStraightTrack;
            function drawCurvedTrack(context, drawPlanks) {
                if (drawPlanks) {
                    drawCurvedPlank(context, 20 * Math.PI / 180);
                    drawCurvedPlank(context, 45 * Math.PI / 180);
                    drawCurvedPlank(context, 70 * Math.PI / 180);
                }
                context.lineWidth = 1;
                context.strokeStyle = trackColour;
                var finishAngle = Math.PI / 2;
                context.beginPath();
                context.arc(0, 0, play.firstTrackPosY, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.firstTrackPosY + play.trackWidth, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.secondTrackPosY - play.trackWidth, 0, finishAngle, false);
                context.stroke();
                context.beginPath();
                context.arc(0, 0, play.secondTrackPosY, 0, finishAngle, false);
                context.stroke();
            }
            CellRenderer.drawCurvedTrack = drawCurvedTrack;
            function drawCurvedPlank(context, basePos) {
                var cos = Math.cos(basePos);
                var sin = Math.sin(basePos);
                context.lineWidth = play.trackWidth;
                context.strokeStyle = plankColour;
                context.beginPath();
                context.moveTo((play.firstTrackPosY - play.trackWidth) * cos, (play.firstTrackPosY - play.trackWidth) * sin);
                context.lineTo((play.firstTrackPosY) * cos, (play.firstTrackPosY) * sin);
                context.moveTo((play.firstTrackPosY + play.trackWidth) * cos, (play.firstTrackPosY + play.trackWidth) * sin);
                context.lineTo((play.secondTrackPosY - play.trackWidth) * cos, (play.secondTrackPosY - play.trackWidth) * sin);
                context.moveTo((play.secondTrackPosY) * cos, (play.secondTrackPosY) * sin);
                context.lineTo((play.secondTrackPosY + play.trackWidth) * cos, (play.secondTrackPosY + play.trackWidth) * sin);
                context.stroke();
            }
            CellRenderer.drawCurvedPlank = drawCurvedPlank;
        })(CellRenderer = play.CellRenderer || (play.CellRenderer = {}));
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
