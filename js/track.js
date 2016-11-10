/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
/// <reference path="play.cell.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Track = (function (_super) {
            __extends(Track, _super);
            function Track() {
                _super.apply(this, arguments);
            }
            Track.prototype.draw = function (context) {
                context.save();
                //This is a comment - PushTest
                context.translate(this.x + 0.5, this.y + 0.5);
                trains.play.CellRenderer.clearCell(context);
                switch (this.direction) {
                    case 2 /* Horizontal */: {
                        var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.left === undefined, neighbours.right === undefined);
                        break;
                    }
                    case 1 /* Vertical */: {
                        var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        trains.play.CellRenderer.drawStraightTrack(context, neighbours.up === undefined, neighbours.down === undefined);
                        break;
                    }
                    case 6 /* LeftUp */: {
                        this.leftUp(context, true);
                        break;
                    }
                    case 5 /* LeftDown */: {
                        this.leftDown(context, true);
                        break;
                    }
                    case 3 /* RightUp */: {
                        this.rightUp(context, true);
                        break;
                    }
                    case 4 /* RightDown */: {
                        this.rightDown(context, true);
                        break;
                    }
                    case 7 /* Cross */: {
                        trains.play.CellRenderer.drawStraightTrack(context, false, false);
                        context.translate(trains.play.gridSize, 0);
                        context.rotate(Math.PI / 2);
                        trains.play.CellRenderer.drawStraightTrack(context, false, false);
                        break;
                    }
                    case 8 /* LeftUpLeftDown */: {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.leftDown(context, !this.switchState);
                        context.restore();
                        break;
                    }
                    case 9 /* LeftUpRightUp */: {
                        context.save();
                        this.leftUp(context, this.switchState);
                        context.restore();
                        this.rightUp(context, !this.switchState);
                        context.restore();
                        break;
                    }
                    case 10 /* RightDownRightUp */: {
                        context.save();
                        this.rightDown(context, !this.switchState);
                        context.restore();
                        this.rightUp(context, this.switchState);
                        context.restore();
                        break;
                    }
                    case 11 /* RightDownLeftDown */: {
                        context.save();
                        this.rightDown(context, !this.switchState);
                        context.restore();
                        this.leftDown(context, this.switchState);
                        context.restore();
                        break;
                    }
                }
                context.restore();
            };
            Track.prototype.rightDown = function (context, drawPlanks) {
                context.translate(trains.play.gridSize, trains.play.gridSize);
                context.rotate(Math.PI);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.rightUp = function (context, drawPlanks) {
                context.translate(trains.play.gridSize, 0);
                context.rotate(Math.PI / 2);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftUp = function (context, drawPlanks) {
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.leftDown = function (context, drawPlanks) {
                context.translate(0, trains.play.gridSize);
                context.rotate(Math.PI * 1.5);
                trains.play.CellRenderer.drawCurvedTrack(context, drawPlanks);
            };
            Track.prototype.turnAroundBrightEyes = function () {
                if (this.direction === 11 /* RightDownLeftDown */) {
                    this.direction = 1 /* Vertical */;
                }
                else {
                    this.direction = this.direction + 1;
                }
                this.draw(trains.play.GameBoard.trackContext);
                var neighbours = trains.play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                neighbours.all.forEach(function (neighbour) {
                    neighbour.draw(trains.play.GameBoard.trackContext);
                });
            };
            return Track;
        })(play.Cell);
        play.Track = Track;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
