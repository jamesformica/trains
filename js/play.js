/// <reference path="../types/jqueryui.d.ts" />
/// <reference path="play.board.ts" />
/// <reference path="util.ts" />
/// <reference path="event.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        function InitialisePlay($container) {
            var manager = new trains.play.PlayManager($container);
        }
        play.InitialisePlay = InitialisePlay;
        play.GameBoard;
        var PlayManager = (function () {
            function PlayManager($container) {
                this.$container = $container;
                this.playComponents = GetPlayComponent($container);
                trains.play.GameBoard = new trains.play.Board(this.playComponents);
                var top = ($(window).height() - trains.play.GameBoard.canvasHeight) / 2;
                var left = ($(window).width() - trains.play.GameBoard.canvasWidth) / 2;
                $('body').height($(window).height());
                this.playComponents.$trackButtons.css("top", top);
                this.playComponents.$trainButtons.css("top", 15).css("right", 15);
                this.playComponents.$mute.width(left);
                this.playComponents.$autosave.width(left);
                this.playComponents.$trainButtons.draggable({
                    handle: '.ui-handle',
                    containment: 'body'
                });
                this.AttachEvents();
                play.GameBoard.loadCells();
            }
            PlayManager.prototype.AttachEvents = function () {
                var _this = this;
                this.playComponents.$globalButtons.find('.ui-title').click(function () {
                    _this.playComponents.$globalButtons.toggleClass("minimised");
                });
                this.playComponents.$globalButtons.find('.ui-minimise').click(function () {
                    _this.playComponents.$globalButtons.addClass("minimised");
                });
                this.playComponents.$globalButtons.find('button').click(function (event) {
                    trains.play.GameBoard.globalControlClick(event.currentTarget);
                });
                this.playComponents.$trainButtons.find('.ui-close').click(function () {
                    trains.play.GameBoard.hideTrainControls();
                });
                this.playComponents.$trainButtons.find('button').click(function (event) {
                    trains.play.GameBoard.trainControlClick(event.currentTarget);
                });
                this.playComponents.$trackButtons.find('button').click(function (event) {
                    trains.play.GameBoard.trackControlClick(event.currentTarget);
                    trains.util.selectButton($(event.currentTarget));
                });
                this.playComponents.$mute.click(function () {
                    var $mute = _this.playComponents.$mute;
                    var mute = trains.util.toBoolean($mute.val());
                    if (!mute) {
                        $mute.val("true");
                    }
                    else {
                        $mute.val("false");
                    }
                    trains.play.GameBoard.setMuted(!mute);
                });
                this.playComponents.$autosave.click(function () {
                    var $autosave = _this.playComponents.$autosave;
                    var autosave = trains.util.toBoolean($autosave.val());
                    if (!autosave) {
                        $autosave.val("true");
                    }
                    else {
                        $autosave.val("false");
                    }
                    trains.play.GameBoard.setAutoSave(!autosave);
                });
                trains.event.On("speedchanged", function (event, trainID, speed) {
                    var setTrainSpeed = false;
                    if (trains.play.GameBoard.selectedTrain !== undefined) {
                        if (trainID === trains.play.GameBoard.selectedTrain.id) {
                            setTrainSpeed = true;
                        }
                    }
                    else {
                        setTrainSpeed = true;
                    }
                    if (setTrainSpeed) {
                        _this.DisplayTrainSpeed(speed);
                    }
                });
                trains.event.On("showtraincontrols", function (event, train) {
                    _this.playComponents.$trainName.text(train.name);
                    _this.playComponents.$trainButtons.addClass("flipInX").show();
                    _this.playComponents.$trainButtons.one(trains.play.animationEndEventString, function () {
                        _this.playComponents.$trainButtons.removeClass("flipInX");
                    });
                    _this.DisplayTrainSpeed(train.getTrainSpeed());
                });
                trains.event.On("hidetraincontrols", function (event) {
                    _this.playComponents.$trainButtons.addClass("flipOutX");
                    _this.playComponents.$trainButtons.one(trains.play.animationEndEventString, function () {
                        _this.playComponents.$trainButtons.removeClass("flipOutX").hide();
                    });
                });
            };
            PlayManager.prototype.DisplayTrainSpeed = function (speed) {
                this.playComponents.$trainButtons.find('.ui-speed').text((speed * 10).toString() + " kms/h");
            };
            return PlayManager;
        })();
        play.PlayManager = PlayManager;
        function GetPlayComponent($container) {
            var $trainCanvas = $container.find('.ui-train-canvas');
            var $trackCanvas = $container.find('.ui-track-canvas');
            var $gridCanvas = $container.find('.ui-grid-canvas');
            var $trainLogoCanvas = $container.find('.ui-train-logo-canvas');
            return {
                $trainCanvas: $trainCanvas,
                $trackCanvas: $trackCanvas,
                $gridCanvas: $gridCanvas,
                $trainLogoCanvas: $trainLogoCanvas,
                $canvases: $().add($trainCanvas).add($trackCanvas).add($gridCanvas),
                $trackButtons: $container.find('.ui-track-buttons'),
                $trainButtons: $container.find('.ui-train-buttons'),
                $globalButtons: $container.find('.ui-game-buttons'),
                $trainName: $container.find('.ui-train-name'),
                $mute: $container.find('.ui-mute'),
                $autosave: $container.find('.ui-autosave')
            };
        }
        play.GetPlayComponent = GetPlayComponent;
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
