/// <reference path="play.board.ts" />
var trains;
(function (trains) {
    var play;
    (function (play) {
        var TrainRenderer;
        (function (TrainRenderer) {
            // dark then light
            TrainRenderer.trainColours = [
                ["#7A040B", "#DD2C3E"],
                ["#4272DC", "#759cef"],
                ["#2e9b3d", "#66d174"],
                ["#44096d", "#8644b5"],
                ["#8644b5", "#f4ef53"]
            ];
            var halfGridSize = trains.play.gridSize / 2;
            var trainWidth = play.secondTrackPosY - play.firstTrackPosY;
            var trainLength = trains.play.gridSize;
            var leftX = play.firstTrackPosY * -1;
            var rightX = leftX + trainWidth;
            var frontY = halfGridSize * -1;
            var backY = halfGridSize;
            // DRAW ASSUMING TRAIN FACING UP
            var baseColour = "#111111";
            var roofPoke = 2;
            var roofWidth = trainWidth + roofPoke * 2;
            var roofLength = 12;
            var roofX = leftX - roofPoke;
            var roofY = backY - roofLength;
            var shaftPadding = 4;
            var shaftWidth = trainWidth - shaftPadding * 2;
            var shaftLength = trainLength - shaftPadding;
            var shaftX = leftX + shaftPadding;
            var shaftY = frontY + shaftPadding;
            var bumperPoke = 2;
            var bumperWidth = 1;
            var bumperLength = 3;
            var bumperOffset = 3;
            var lightAngleInDegrees = 60;
            var lightDistance = 80;
            var lightFalloffDistance = 30;
            function GetRandomShaftColour() {
                return Math.floor(Math.random() * trains.play.TrainRenderer.trainColours.length);
            }
            TrainRenderer.GetRandomShaftColour = GetRandomShaftColour;
            function DrawChoochooLights(context) {
                var xOffset = lightDistance * Math.tan(lightAngleInDegrees * (180 / Math.PI)) / 2;
                context.beginPath();
                var leftLightGradient = context.createRadialGradient(leftX, frontY - bumperPoke, lightFalloffDistance, leftX, frontY - bumperPoke, lightDistance);
                leftLightGradient.addColorStop(0, "#BBBBBB");
                leftLightGradient.addColorStop(1, 'rgba(187,187,187,0)');
                context.fillStyle = leftLightGradient;
                context.moveTo(0, frontY - bumperPoke);
                context.lineTo(0 - xOffset, (frontY - bumperPoke) - lightDistance);
                //Need to implement circle tip here instead of flat
                context.lineTo(0 + xOffset, (frontY - bumperPoke) - lightDistance);
                context.lineTo(0, frontY - bumperPoke);
                context.fill();
            }
            TrainRenderer.DrawChoochooLights = DrawChoochooLights;
            function DrawChoochoo(context, shaftColourIndex) {
                var shaftColour = TrainRenderer.trainColours[shaftColourIndex];
                if (shaftColourIndex === -1) {
                    shaftColour = TrainRenderer.trainColours[GetRandomShaftColour()];
                }
                context.fillStyle = baseColour;
                context.fillRect(leftX, frontY, trainWidth, trainLength);
                context.fillStyle = GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
                context.fillRect(shaftX, shaftY, shaftWidth, shaftLength);
                context.fillStyle = GetRoofFillStyle(context, baseColour, "#5d5d5d");
                context.fillRect(roofX, roofY, roofWidth, roofLength);
                context.strokeRect(roofX, roofY, roofWidth, roofLength);
                context.fillStyle = baseColour;
                context.beginPath();
                context.arc(shaftX + (shaftWidth / 2), shaftY + 6, 2, 0, 2 * Math.PI);
                context.stroke();
                context.closePath;
                context.fill();
                DrawBumpers(context, true);
                DrawBumpers(context, false);
            }
            TrainRenderer.DrawChoochoo = DrawChoochoo;
            function DrawCarriage(context, shaftColourIndex) {
                var shaftColour = TrainRenderer.trainColours[shaftColourIndex];
                if (shaftColourIndex === -1) {
                    shaftColour = TrainRenderer.trainColours[GetRandomShaftColour()];
                }
                context.fillStyle = baseColour;
                context.fillRect(leftX, frontY, trainWidth, trainLength);
                context.fillStyle = GetShaftFillStyle(context, shaftColour[0], shaftColour[1]);
                context.fillRect(shaftX, shaftY, shaftWidth, shaftLength - shaftPadding);
            }
            TrainRenderer.DrawCarriage = DrawCarriage;
            function GetRoofFillStyle(context, firstColour, secondColour) {
                var x2 = roofX + roofWidth;
                var grd = context.createLinearGradient(roofX, roofY, x2, roofY);
                grd.addColorStop(0, firstColour);
                grd.addColorStop(0.5, secondColour);
                grd.addColorStop(1, firstColour);
                return grd;
            }
            function GetShaftFillStyle(context, firstColour, secondColour) {
                var x2 = shaftX + shaftWidth;
                var grd = context.createLinearGradient(shaftX, shaftY, x2, shaftY);
                grd.addColorStop(0, firstColour);
                grd.addColorStop(0.5, secondColour);
                grd.addColorStop(1, firstColour);
                return grd;
            }
            function DrawBumpers(context, upFront) {
                var y;
                var bumperY;
                if (upFront) {
                    y = frontY;
                    bumperY = frontY - bumperPoke;
                }
                else {
                    y = backY;
                    bumperY = backY + bumperPoke;
                }
                context.beginPath();
                context.lineWidth = bumperWidth;
                context.strokeStyle = baseColour;
                context.moveTo(leftX + bumperOffset, bumperY);
                context.lineTo(leftX + bumperOffset, y);
                context.moveTo(leftX + bumperOffset - (bumperLength / 2), bumperY);
                context.lineTo(leftX + bumperOffset + (bumperLength / 2), bumperY);
                context.moveTo(rightX - bumperOffset, bumperY);
                context.lineTo(rightX - bumperOffset, y);
                context.moveTo(rightX - bumperOffset - (bumperLength / 2), bumperY);
                context.lineTo(rightX - bumperOffset + (bumperLength / 2), bumperY);
                context.stroke();
            }
        })(TrainRenderer = play.TrainRenderer || (play.TrainRenderer = {}));
    })(play = trains.play || (trains.play = {}));
})(trains || (trains = {}));
