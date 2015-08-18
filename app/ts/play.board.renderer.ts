/// <reference path="play.board.ts" />
/// <reference path="play.cell.ts" />

module trains.play.BoardRenderer {

    export function drawGrid(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {

        context.beginPath();

        for (var x = gridSize; x < canvasWidth; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }

        for (var y = gridSize; y < canvasHeight; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }

        context.strokeStyle = gridColour;
        context.stroke();
    }

    export function redrawCells(cells: trains.play.BoardCells, context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        clearCells(context, canvasWidth, canvasHeight);

        for (var id in cells) {
            if (cells.hasOwnProperty(id)) {
                if (!isNaN(id)) {
                    cells[id].draw(context);
                }
            }
        }
    }

    export function clearCells(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        context.beginPath();
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.closePath();
    }

}