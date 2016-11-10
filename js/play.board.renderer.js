/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var BoardRenderer;
        (function (BoardRenderer) {
            function drawGrid(context, canvasWidth, canvasHeight) {
                context.beginPath();
                for (var x = play.gridSize; x < canvasWidth; x += play.gridSize) {
                    context.moveTo(x, 0);
                    context.lineTo(x, canvasHeight);
                }
                for (var y = play.gridSize; y < canvasHeight; y += play.gridSize) {
                    context.moveTo(0, y);
                    context.lineTo(canvasWidth, y);
                }
                context.strokeStyle = play.gridColour;
                context.stroke();
            }
            BoardRenderer.drawGrid = drawGrid;
            function redrawCells(cells, context, canvasWidth, canvasHeight) {
                clearCells(context, canvasWidth, canvasHeight);
                for (var id in cells) {
                    if (cells.hasOwnProperty(id)) {
                        cells[id].draw(context);
                    }
                }
            }
            BoardRenderer.redrawCells = redrawCells;
            function clearCells(context, canvasWidth, canvasHeight) {
                context.beginPath();
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                context.closePath();
            }
            BoardRenderer.clearCells = clearCells;
        })(BoardRenderer = play.BoardRenderer || (play.BoardRenderer = {}));
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
