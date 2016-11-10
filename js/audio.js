var trains;
(function (trains) {
    var audio;
    (function (audio) {
        var Player = (function () {
            function Player() {
                this.muted = false;
                this.basePath = "audio/";
            }
            Player.prototype.setMuted = function (mute) {
                this.muted = mute;
            };
            Player.prototype.playSound = function (sound) {
                if (!this.muted) {
                    var fileName;
                    switch (sound) {
                        case 0 /* click */: {
                            fileName = "click.mp3";
                            break;
                        }
                    }
                    if (fileName !== undefined) {
                        var soundToPlay = new Audio(this.basePath + fileName);
                        if (soundToPlay !== undefined) {
                            soundToPlay.play();
                        }
                    }
                }
            };
            return Player;
        })();
        audio.Player = Player;
        (function (Sound) {
            Sound[Sound["click"] = 0] = "click";
        })(audio.Sound || (audio.Sound = {}));
        var Sound = audio.Sound;
    })(audio = trains.audio || (trains.audio = {}));
})(trains || (trains = {}));
