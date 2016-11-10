/// <reference path="../types/jquery.d.ts" />
/// <reference path="../types/awesomeCursor.d.ts" />
/// <reference path="play.ts" />
/// <reference path="play.cell.ts" />
/// <reference path="play.train.ts" />
/// <reference path="play.board.renderer.ts" />
/// <reference path="track.ts" />
/// <reference path="play.loop.game.ts" />
/// <reference path="play.loop.render.ts" />
/// <reference path="audio.ts" />
/// <reference path="play.particle.smoke.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        play.gridSize = 40;
        play.gridColour = "#eee";
        play.trackWidth = 4;
        play.trackPadding = 10;
        play.firstTrackPosY = play.trackPadding;
        play.secondTrackPosY = trains.play.gridSize - play.trackPadding;
        play.animationEndEventString = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend";
        var Board = (function () {
            function Board(playComponents) {
                var _this = this;
                this.playComponents = playComponents;
                this.cells = {};
                this.trainIDCounter = 0;
                this.trains = new Array();
                this.smokeParticleSystem = new Array();
                this.gameRunningState = true;
                this.showDiagnostics = false;
                this.cheat_alwaysNight = false;
                this.$window = $(window);
                this.trainCanvas = this.playComponents.$trainCanvas.get(0);
                this.trainContext = this.trainCanvas.getContext("2d");
                this.trackCanvas = this.playComponents.$trackCanvas.get(0);
                this.trackContext = this.trackCanvas.getContext("2d");
                this.gridCanvas = this.playComponents.$gridCanvas.get(0);
                this.gridContext = this.gridCanvas.getContext("2d");
                this.trainLogoCanvas = this.playComponents.$trainLogoCanvas.get(0);
                this.trainLogoContext = this.trainLogoCanvas.getContext("2d");
                this.playComponents.$trainLogoCanvas.attr('width', play.gridSize);
                this.playComponents.$trainLogoCanvas.attr('height', play.gridSize);
                this.playComponents.$trainLogoCanvas.width(play.gridSize);
                this.playComponents.$trainLogoCanvas.height(play.gridSize);
                this.canvasWidth = this.roundToNearestGridSize(this.$window.width() - (play.gridSize * 2));
                this.maxColumns = this.canvasWidth / play.gridSize;
                this.canvasHeight = this.roundToNearestGridSize(this.$window.height() - play.gridSize);
                this.maxRows = this.canvasHeight / play.gridSize;
                this.playComponents.$canvases.attr('width', this.canvasWidth);
                this.playComponents.$canvases.attr('height', this.canvasHeight);
                this.playComponents.$canvases.width(this.canvasWidth);
                this.playComponents.$canvases.css('top', (this.$window.height() - this.canvasHeight) / 2);
                this.playComponents.$canvases.css('left', (this.$window.width() - this.canvasWidth) / 2);
                [this.trackCanvas, this.trainCanvas].forEach(function (el) {
                    el.addEventListener('click', function (event) { return _this.cellClick(event); });
                    el.addEventListener('mousemove', function (event) { return _this.cellMoveOver(event); });
                    el.addEventListener('touchstart', function (event) { return false; });
                    el.addEventListener('touchmove', function (event) {
                        _this.cellTouch(event);
                        event.preventDefault();
                        return false;
                    });
                    el.addEventListener('contextmenu', function (ev) {
                        _this.cellRightClick(ev);
                        ev.preventDefault();
                        return false;
                    }, false);
                });
                //Hidden canvas buffer
                this.lightingBufferCanvas = document.createElement('canvas');
                this.lightingBufferCanvas.width = this.canvasWidth;
                this.lightingBufferCanvas.height = this.canvasHeight;
                this.lightingBufferContext = this.lightingBufferCanvas.getContext("2d");
                this.gameLoop = new play.GameLoop(this);
                this.renderLoop = new play.RenderLoop(this);
                trains.play.BoardRenderer.drawGrid(this.gridContext, this.canvasWidth, this.canvasHeight);
                this.gameLoop.startLoop();
                this.renderLoop.startLoop();
                this.player = new trains.audio.Player();
                this.setMuted(trains.util.toBoolean(localStorage.getItem("muted")));
                this.setAutoSave(trains.util.toBoolean(localStorage.getItem("autosave")));
                setTimeout(function () {
                    _this.setTool(1 /* Track */);
                }, 100);
            }
            Board.prototype.loadCells = function () {
                var savedCells = JSON.parse(localStorage.getItem("cells"));
                if (savedCells !== undefined) {
                    for (var id in savedCells) {
                        if (savedCells.hasOwnProperty(id)) {
                            var theCell = savedCells[id];
                            var newCell = new trains.play.Track(theCell.id, theCell.column, theCell.row);
                            newCell.direction = theCell.direction;
                            newCell.happy = theCell.happy;
                            newCell.switchState = theCell.switchState;
                            this.cells[newCell.id] = newCell;
                        }
                    }
                }
                this.redraw();
            };
            Board.prototype.startGame = function () {
                this.gameRunningState = true;
            };
            Board.prototype.stopGame = function () {
                this.gameRunningState = false;
            };
            Board.prototype.redraw = function () {
                trains.play.BoardRenderer.redrawCells(this.cells, this.trackContext, this.canvasWidth, this.canvasHeight);
            };
            Board.prototype.setTool = function (tool) {
                if (tool !== this.tool) {
                    this.tool = tool;
                    var cursorName;
                    var hotspot = 'bottom left';
                    switch (tool) {
                        case 0 /* Pointer */: {
                            cursorName = "hand-pointer-o";
                            hotspot = 'top left';
                            break;
                        }
                        case 1 /* Track */: {
                            cursorName = "pencil";
                            break;
                        }
                        case 4 /* Train */: {
                            cursorName = "train";
                            hotspot = 'center';
                            break;
                        }
                        case 2 /* Eraser */: {
                            cursorName = "eraser";
                            break;
                        }
                        case 3 /* Rotate */: {
                            cursorName = "refresh";
                            hotspot = 'center';
                            break;
                        }
                    }
                    $('body').css('cursor', '');
                    $('body').awesomeCursor(cursorName, {
                        hotspot: hotspot,
                        size: 22
                    });
                }
            };
            Board.prototype.cellMoveOver = function (event) {
                if (event.buttons === 1 && this.tool !== 4 /* Train */ && this.tool !== 3 /* Rotate */ && this.tool !== 0 /* Pointer */) {
                    this.cellClick(event);
                }
            };
            Board.prototype.cellTouch = function (event) {
                if (this.tool === 4 /* Train */)
                    return;
                var column = this.getGridCoord(event.touches[0].pageX - this.trackCanvas.offsetLeft);
                var row = this.getGridCoord(event.touches[0].pageY - this.trackCanvas.offsetTop);
                this.doTool(column, row, event.shiftKey);
            };
            Board.prototype.cellRightClick = function (event) {
                var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
                var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
                this.eraseTrack(column, row);
            };
            Board.prototype.cellClick = function (event) {
                var column = this.getGridCoord(event.pageX - this.trackCanvas.offsetLeft);
                var row = this.getGridCoord(event.pageY - this.trackCanvas.offsetTop);
                this.doTool(column, row, event.shiftKey);
            };
            Board.prototype.doTool = function (column, row, shift) {
                if (row >= this.maxRows || column >= this.maxColumns)
                    return;
                switch (this.tool) {
                    case 0 /* Pointer */:
                        {
                            this.pointAtThing(column, row);
                            break;
                        }
                    case 1 /* Track */:
                        {
                            if (shift) {
                                this.rotateTrack(column, row);
                            }
                            else {
                                this.newTrack(column, row);
                            }
                            break;
                        }
                    case 2 /* Eraser */:
                        {
                            this.eraseTrack(column, row);
                            break;
                        }
                    case 3 /* Rotate */:
                        {
                            this.rotateTrack(column, row);
                            break;
                        }
                    case 4 /* Train */:
                        {
                            var cellID = this.getCellID(column, row);
                            if (this.cells[cellID] !== undefined) {
                                var t = new play.Train(this.trainIDCounter++, this.cells[cellID]);
                                //Pre-move train to stop rendering at an odd angle.
                                t.chooChooMotherFucker(0.1);
                                this.trains.push(t);
                                this.showTrainControls(t);
                            }
                            break;
                        }
                }
            };
            Board.prototype.destroyTrack = function () {
                var _this = this;
                this.hideTrainControls();
                this.trains = new Array();
                var deferreds = new Array();
                for (var id in this.cells) {
                    if (this.cells.hasOwnProperty(id)) {
                        deferreds.push(this.cells[id].destroy());
                    }
                }
                $.when.apply($, deferreds).done(function () {
                    trains.play.BoardRenderer.clearCells(_this.trackContext, _this.canvasWidth, _this.canvasHeight);
                    trains.play.BoardRenderer.clearCells(_this.trainContext, _this.canvasWidth, _this.canvasHeight);
                    _this.cells = {};
                    localStorage.removeItem("cells");
                });
            };
            Board.prototype.rotateTrack = function (column, row) {
                var cellID = this.getCellID(column, row);
                var cell = this.cells[cellID];
                if (cell !== undefined) {
                    cell.turnAroundBrightEyes();
                }
                this.saveTrack();
            };
            Board.prototype.newTrack = function (column, row) {
                var cellID = this.getCellID(column, row);
                if (this.cells[cellID] === undefined) {
                    this.player.playSound(0 /* click */);
                    var newCell = new trains.play.Track(cellID, column, row);
                    this.cells[newCell.id] = newCell;
                    if (!newCell.crossTheRoad()) {
                        newCell.checkYourself();
                    }
                }
                else {
                    this.cells[cellID].haveAThreeWay();
                }
                this.saveTrack();
            };
            Board.prototype.eraseTrack = function (column, row) {
                var _this = this;
                var cellID = this.getCellID(column, row);
                var cell = this.cells[cellID];
                if (cell !== undefined) {
                    delete this.cells[cellID];
                    this.saveTrack();
                    cell.destroy().done(function () {
                        var neighbours = _this.getNeighbouringCells(column, row, true);
                        // some of my neighbours may need to be less happy now
                        if (neighbours.up !== undefined && neighbours.up.happy && neighbours.up.isConnectedDown())
                            neighbours.up.happy = false;
                        if (neighbours.down !== undefined && neighbours.down.happy && neighbours.down.isConnectedUp())
                            neighbours.down.happy = false;
                        if (neighbours.left !== undefined && neighbours.left.happy && neighbours.left.isConnectedRight())
                            neighbours.left.happy = false;
                        if (neighbours.right !== undefined && neighbours.right.happy && neighbours.right.isConnectedLeft())
                            neighbours.right.happy = false;
                        neighbours.all.forEach(function (n) { return n.checkYourself(); });
                    });
                }
            };
            Board.prototype.saveTrack = function () {
                if (trains.util.toBoolean(localStorage.getItem("autosave"))) {
                    localStorage.setItem("cells", JSON.stringify(this.cells));
                }
            };
            Board.prototype.pointAtThing = function (column, row) {
                var _this = this;
                if (!this.trains.some(function (train) {
                    if (train.isTrainHere(column, row)) {
                        _this.showTrainControls(train);
                        return true;
                    }
                    return false;
                })) {
                    // change points?
                    var cellID = this.getCellID(column, row);
                    var cell = this.cells[cellID];
                    if (cell !== undefined) {
                        cell.switchTrack();
                    }
                    this.saveTrack();
                }
            };
            Board.prototype.showChooChoo = function () {
                this.startGame();
            };
            Board.prototype.stopChooChoo = function () {
                this.stopGame();
            };
            Board.prototype.roundToNearestGridSize = function (value) {
                return Math.floor(value / play.gridSize) * play.gridSize;
            };
            Board.prototype.getGridCoord = function (value) {
                return Math.floor(value / play.gridSize);
            };
            Board.prototype.getCellID = function (column, row) {
                return column.toString() + ':' + row.toString();
            };
            Board.prototype.getCell = function (column, row) {
                return this.cells[this.getCellID(column, row)];
            };
            Board.prototype.getNeighbouringCells = function (column, row, includeHappyNeighbours) {
                if (includeHappyNeighbours === void 0) { includeHappyNeighbours = false; }
                var up = this.cells[this.getCellID(column, row - 1)];
                var right = this.cells[this.getCellID(column + 1, row)];
                var down = this.cells[this.getCellID(column, row + 1)];
                var left = this.cells[this.getCellID(column - 1, row)];
                // if any of the neighbours are happy, and not happy with us, then we need to ignore them
                if (!includeHappyNeighbours) {
                    if (up !== undefined && up.happy && !up.isConnectedDown())
                        up = undefined;
                    if (right !== undefined && right.happy && !right.isConnectedLeft())
                        right = undefined;
                    if (down !== undefined && down.happy && !down.isConnectedUp())
                        down = undefined;
                    if (left !== undefined && left.happy && !left.isConnectedRight())
                        left = undefined;
                }
                var all = [up, right, down, left].filter(function (n) { return n !== undefined; });
                return {
                    up: up,
                    right: right,
                    down: down,
                    left: left,
                    all: all
                };
            };
            Board.prototype.trackControlClick = function (option) {
                var $option = $(option);
                switch ($option.data("action").toLowerCase()) {
                    case "pointer": {
                        this.setTool(0 /* Pointer */);
                        break;
                    }
                    case "train": {
                        this.setTool(4 /* Train */);
                        break;
                    }
                    case "pencil": {
                        this.setTool(1 /* Track */);
                        break;
                    }
                    case "eraser": {
                        this.setTool(2 /* Eraser */);
                        break;
                    }
                    case "rotate": {
                        this.setTool(3 /* Rotate */);
                        break;
                    }
                    case "bomb": {
                        var response = confirm("Are you sure buddy?");
                        if (response) {
                            this.destroyTrack();
                            this.setTool(1 /* Track */);
                        }
                        break;
                    }
                }
            };
            Board.prototype.trainControlClick = function (option) {
                if (this.selectedTrain !== undefined) {
                    var $option = $(option);
                    switch ($option.data("action").toLowerCase()) {
                        case "play": {
                            this.selectedTrain.wakeMeUp();
                            break;
                        }
                        case "pause": {
                            this.selectedTrain.hammerTime();
                            break;
                        }
                        case "forward": {
                            this.selectedTrain.fasterFasterFaster();
                            break;
                        }
                        case "backward": {
                            this.selectedTrain.slowYourRoll();
                            break;
                        }
                        case "delete": {
                            for (var i = 0; i < this.trains.length; i++) {
                                if (this.trains[i].id === this.selectedTrain.id) {
                                    this.trains.splice(i, 1);
                                    this.hideTrainControls();
                                    break;
                                }
                            }
                            break;
                        }
                        case "spawncarriage": {
                            this.selectedTrain.spawnCarriage();
                            break;
                        }
                        case "removecarriage": {
                            this.selectedTrain.removeEndCarriage(this.selectedTrain);
                            break;
                        }
                        case "turnaround": {
                            this.selectedTrain.turnTheBeatAround();
                            break;
                        }
                    }
                }
                else {
                    this.hideTrainControls();
                }
            };
            Board.prototype.globalControlClick = function (option) {
                var $option = $(option);
                switch ($option.data("action").toLowerCase()) {
                    case "play": {
                        this.gameLoop.startLoop();
                        break;
                    }
                    case "pause": {
                        this.gameLoop.stopLoop();
                        break;
                    }
                    case "forward": {
                        this.trains.forEach(function (t) { return t.fasterFasterFaster(); });
                        break;
                    }
                    case "backward": {
                        this.trains.forEach(function (t) { return t.slowYourRoll(); });
                        break;
                    }
                }
            };
            Board.prototype.showTrainControls = function (train) {
                this.selectedTrain = train;
                trains.event.Emit("showtraincontrols", this.selectedTrain);
            };
            Board.prototype.hideTrainControls = function () {
                this.selectedTrain = undefined;
                trains.event.Emit("hidetraincontrols");
            };
            Board.prototype.setMuted = function (mute) {
                localStorage.setItem("muted", mute.toString());
                if (mute) {
                    this.playComponents.$mute.removeClass("fa-volume-up").addClass("fa-volume-off");
                }
                else {
                    this.playComponents.$mute.removeClass("fa-volume-off").addClass("fa-volume-up");
                }
                this.player.setMuted(mute);
            };
            Board.prototype.setAutoSave = function (autosave) {
                localStorage.setItem("autosave", autosave.toString());
                if (autosave) {
                    this.playComponents.$autosave.css("color", "green");
                }
                else {
                    localStorage.removeItem("cells");
                    this.playComponents.$autosave.css("color", "black");
                }
            };
            return Board;
        })();
        play.Board = Board;
        (function (Tool) {
            Tool[Tool["Pointer"] = 0] = "Pointer";
            Tool[Tool["Track"] = 1] = "Track";
            Tool[Tool["Eraser"] = 2] = "Eraser";
            Tool[Tool["Rotate"] = 3] = "Rotate";
            Tool[Tool["Train"] = 4] = "Train";
        })(play.Tool || (play.Tool = {}));
        var Tool = play.Tool;
        (function (Direction) {
            Direction[Direction["None"] = 0] = "None";
            Direction[Direction["Vertical"] = 1] = "Vertical";
            Direction[Direction["Horizontal"] = 2] = "Horizontal";
            Direction[Direction["RightUp"] = 3] = "RightUp";
            Direction[Direction["RightDown"] = 4] = "RightDown";
            Direction[Direction["LeftDown"] = 5] = "LeftDown";
            Direction[Direction["LeftUp"] = 6] = "LeftUp";
            Direction[Direction["Cross"] = 7] = "Cross";
            Direction[Direction["LeftUpLeftDown"] = 8] = "LeftUpLeftDown";
            Direction[Direction["LeftUpRightUp"] = 9] = "LeftUpRightUp";
            Direction[Direction["RightDownRightUp"] = 10] = "RightDownRightUp";
            Direction[Direction["RightDownLeftDown"] = 11] = "RightDownLeftDown";
        })(play.Direction || (play.Direction = {}));
        var Direction = play.Direction;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
