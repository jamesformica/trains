/// <reference path="play.board.ts" />
/// <reference path="play.cell.renderer.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var Cell = (function () {
            function Cell(id, column, row) {
                this.id = id;
                this.column = column;
                this.row = row;
                this.happy = false;
                this.x = this.column * trains.play.gridSize;
                this.y = this.row * trains.play.gridSize;
                this.direction = 0 /* None */;
            }
            Cell.prototype.draw = function (context) {
                throw new Error("This method is abstract.. no really.. come on.. just pretend! It will be fun I promise.");
            };
            Cell.prototype.turnAroundBrightEyes = function () {
                throw new Error("abstract");
            };
            Cell.prototype.checkYourself = function () {
                var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                var changed = this.determineDirection(neighbours);
                this.happy = (neighbours.all.length > 1);
                this.draw(play.GameBoard.trackContext);
                if (changed) {
                    var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                    neighbours.all.forEach(function (n) { return n.checkYourself(); });
                }
            };
            Cell.prototype.crossTheRoad = function () {
                var neighbours = play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                return neighbours.all.some(function (c) {
                    var myNeighbours = play.GameBoard.getNeighbouringCells(c.column, c.row, true);
                    if (myNeighbours.all.length < 4)
                        return false;
                    if (!myNeighbours.up.isConnectedDown() && myNeighbours.up.happy)
                        return false;
                    if (!myNeighbours.down.isConnectedUp() && myNeighbours.down.happy)
                        return false;
                    if (!myNeighbours.left.isConnectedRight() && myNeighbours.left.happy)
                        return false;
                    if (!myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy)
                        return false;
                    // if we got here, we should be a cross
                    c.direction = 7 /* Cross */;
                    c.happy = true;
                    c.draw(play.GameBoard.trackContext);
                    myNeighbours = play.GameBoard.getNeighbouringCells(c.column, c.row);
                    myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
                    return true;
                });
            };
            Cell.prototype.haveAThreeWay = function () {
                var myNeighbours = play.GameBoard.getNeighbouringCells(this.column, this.row, true);
                if (myNeighbours.all.length < 3)
                    return false;
                if ([myNeighbours.up, myNeighbours.right, myNeighbours.down, myNeighbours.left].filter(function (n) { return n !== undefined; }).length === 3) {
                    if (myNeighbours.up !== undefined && !myNeighbours.up.isConnectedDown() && myNeighbours.up.happy)
                        return false;
                    if (myNeighbours.down !== undefined && !myNeighbours.down.isConnectedUp() && myNeighbours.down.happy)
                        return false;
                    if (myNeighbours.left !== undefined && !myNeighbours.left.isConnectedRight() && myNeighbours.left.happy)
                        return false;
                    if (myNeighbours.right !== undefined && !myNeighbours.right.isConnectedLeft() && myNeighbours.right.happy)
                        return false;
                    if (myNeighbours.up === undefined) {
                        this.direction = 11 /* RightDownLeftDown */;
                    }
                    else if (myNeighbours.down === undefined) {
                        this.direction = 9 /* LeftUpRightUp */;
                    }
                    else if (myNeighbours.left === undefined) {
                        this.direction = 10 /* RightDownRightUp */;
                    }
                    else if (myNeighbours.right === undefined) {
                        this.direction = 8 /* LeftUpLeftDown */;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (myNeighbours.up.isConnectedDown() && myNeighbours.down.isConnectedUp() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = 10 /* RightDownRightUp */;
                    }
                    else if (myNeighbours.up.isConnectedDown() && myNeighbours.down.isConnectedUp() && myNeighbours.left.isConnectedRight()) {
                        this.direction = 8 /* LeftUpLeftDown */;
                    }
                    else if (myNeighbours.left.isConnectedRight() && myNeighbours.down.isConnectedUp() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = 11 /* RightDownLeftDown */;
                    }
                    else if (myNeighbours.up.isConnectedDown() && myNeighbours.left.isConnectedRight() && myNeighbours.right.isConnectedLeft()) {
                        this.direction = 9 /* LeftUpRightUp */;
                    }
                    else {
                        return false;
                    }
                }
                // if we got here, we should be a three way
                this.happy = true;
                this.draw(play.GameBoard.trackContext);
                myNeighbours = play.GameBoard.getNeighbouringCells(this.column, this.row);
                myNeighbours.all.forEach(function (c2) { return c2.checkYourself(); });
                return true;
            };
            Cell.prototype.switchTrack = function () {
                if (this.direction === 8 /* LeftUpLeftDown */ || this.direction === 9 /* LeftUpRightUp */ || this.direction === 11 /* RightDownLeftDown */ || this.direction === 10 /* RightDownRightUp */) {
                    this.switchState = !this.switchState;
                    this.draw(play.GameBoard.trackContext);
                }
            };
            Cell.prototype.determineDirection = function (neighbours) {
                if (this.happy)
                    return false;
                var newDirection;
                if (neighbours.left !== undefined && neighbours.right !== undefined && neighbours.up !== undefined && neighbours.down !== undefined) {
                    newDirection = 7 /* Cross */;
                }
                else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.up !== undefined) {
                    if (neighbours.down !== undefined) {
                        newDirection = 8 /* LeftUpLeftDown */;
                    }
                    else {
                        newDirection = 6 /* LeftUp */;
                    }
                }
                else if (neighbours.left !== undefined && neighbours.right === undefined && neighbours.down !== undefined) {
                    newDirection = 5 /* LeftDown */;
                }
                else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.up !== undefined) {
                    if (neighbours.down !== undefined) {
                        newDirection = 10 /* RightDownRightUp */; // last one
                    }
                    else {
                        newDirection = 3 /* RightUp */;
                    }
                }
                else if (neighbours.left === undefined && neighbours.right !== undefined && neighbours.down !== undefined) {
                    newDirection = 4 /* RightDown */;
                }
                else if (neighbours.up !== undefined && neighbours.down !== undefined) {
                    newDirection = 1 /* Vertical */;
                }
                else if (neighbours.left !== undefined && neighbours.right !== undefined) {
                    if (neighbours.up !== undefined) {
                        newDirection = 9 /* LeftUpRightUp */;
                    }
                    else if (neighbours.down !== undefined) {
                        newDirection = 11 /* RightDownLeftDown */;
                    }
                    else {
                        newDirection = 2 /* Horizontal */;
                    }
                }
                else if (neighbours.up !== undefined || neighbours.down !== undefined) {
                    newDirection = 1 /* Vertical */;
                }
                else if (neighbours.left !== undefined || neighbours.right !== undefined) {
                    newDirection = 2 /* Horizontal */;
                }
                else {
                    newDirection = 2 /* Horizontal */;
                }
                if (newDirection !== undefined && newDirection !== this.direction) {
                    this.direction = newDirection;
                    return true;
                }
                return false;
            };
            Cell.prototype.isConnectedUp = function () {
                return this.direction === 1 /* Vertical */ || this.direction === 6 /* LeftUp */ || this.direction === 3 /* RightUp */ || this.direction === 7 /* Cross */ || this.direction === 8 /* LeftUpLeftDown */ || this.direction === 9 /* LeftUpRightUp */ || this.direction === 10 /* RightDownRightUp */;
            };
            Cell.prototype.isConnectedDown = function () {
                return this.direction === 1 /* Vertical */ || this.direction === 5 /* LeftDown */ || this.direction === 4 /* RightDown */ || this.direction === 7 /* Cross */ || this.direction === 8 /* LeftUpLeftDown */ || this.direction === 11 /* RightDownLeftDown */ || this.direction === 10 /* RightDownRightUp */;
            };
            Cell.prototype.isConnectedLeft = function () {
                return this.direction === 2 /* Horizontal */ || this.direction === 6 /* LeftUp */ || this.direction === 5 /* LeftDown */ || this.direction === 7 /* Cross */ || this.direction === 8 /* LeftUpLeftDown */ || this.direction === 9 /* LeftUpRightUp */ || this.direction === 11 /* RightDownLeftDown */;
            };
            Cell.prototype.isConnectedRight = function () {
                return this.direction === 2 /* Horizontal */ || this.direction === 4 /* RightDown */ || this.direction === 3 /* RightUp */ || this.direction === 7 /* Cross */ || this.direction === 11 /* RightDownLeftDown */ || this.direction === 9 /* LeftUpRightUp */ || this.direction === 10 /* RightDownRightUp */;
            };
            Cell.prototype.destroy = function () {
                var _this = this;
                var def = $.Deferred();
                this.destroyLoop(def, 0);
                def.done(function () {
                    play.GameBoard.trackContext.clearRect(_this.x, _this.y, trains.play.gridSize, trains.play.gridSize);
                });
                return def;
            };
            Cell.prototype.destroyLoop = function (deferred, counter) {
                var _this = this;
                setTimeout(function () {
                    var x = Math.floor(Math.random() * trains.play.gridSize);
                    var y = Math.floor(Math.random() * trains.play.gridSize);
                    play.GameBoard.trackContext.clearRect(_this.x + x, _this.y + y, 5, 5);
                    counter++;
                    if (counter < 40) {
                        _this.destroyLoop(deferred, counter);
                    }
                    else {
                        deferred.resolve();
                    }
                }, 10);
            };
            Cell.prototype.getDirectionToUse = function (lastCell) {
                if (lastCell !== undefined) {
                    var neighbours = play.GameBoard.getNeighbouringCells(lastCell.column, lastCell.row);
                    if (this.direction === 8 /* LeftUpLeftDown */) {
                        if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? 6 /* LeftUp */ : 5 /* LeftDown */;
                    }
                    else if (this.direction === 9 /* LeftUpRightUp */) {
                        if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? 6 /* LeftUp */ : 3 /* RightUp */;
                    }
                    else if (this.direction === 11 /* RightDownLeftDown */) {
                        if (lastCell !== undefined && lastCell.isConnectedLeft() && neighbours.left === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedRight() && neighbours.right === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? 5 /* LeftDown */ : 4 /* RightDown */;
                    }
                    else if (this.direction === 10 /* RightDownRightUp */) {
                        if (lastCell !== undefined && lastCell.isConnectedDown() && neighbours.down === this) {
                            if (!this.switchState)
                                this.switchTrack();
                        }
                        else if (lastCell !== undefined && lastCell.isConnectedUp() && neighbours.up === this) {
                            if (this.switchState)
                                this.switchTrack();
                        }
                        return this.switchState ? 3 /* RightUp */ : 4 /* RightDown */;
                    }
                }
                return this.direction;
            };
            return Cell;
        })();
        play.Cell = Cell;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
