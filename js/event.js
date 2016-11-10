var trains;
(function (trains) {
    var event;
    (function (_event) {
        var globalEventID = 1;
        var globalEvents = {};
        function On(eventName, callback) {
            var id = globalEventID;
            globalEventID++;
            var existingEvents = globalEvents[eventName];
            if (existingEvents === undefined) {
                globalEvents[eventName] = new Array();
                existingEvents = globalEvents[eventName];
            }
            existingEvents.push({
                id: id,
                callback: callback
            });
            return id;
        }
        _event.On = On;
        function Emit(eventName) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var existingEvents = globalEvents[eventName];
            if (existingEvents !== undefined) {
                var eventObject = {
                    eventName: eventName,
                    data: data
                };
                var callbackData = [eventObject];
                for (var i = 0; i < data.length; i++) {
                    callbackData.push(data[i]);
                }
                for (var i = 0; i < existingEvents.length; i++) {
                    existingEvents[i].callback.apply(null, callbackData);
                }
            }
        }
        _event.Emit = Emit;
        function Unsubscribe(eventID) {
            for (var eventName in globalEvents) {
                if (globalEvents.hasOwnProperty(eventName) && globalEvents[eventName] !== undefined) {
                    for (var i = 0; i < globalEvents[eventName].length; i++) {
                        if (globalEvents[eventName][i].id === eventID) {
                            globalEvents[eventName].splice(i, 1);
                            return;
                        }
                    }
                }
            }
        }
        _event.Unsubscribe = Unsubscribe;
    })(event = trains.event || (trains.event = {}));
})(trains || (trains = {}));
