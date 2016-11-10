/// <reference path="../types/jqueryui.d.ts" />
var trains;
(function (trains) {
    var util;
    (function (util) {
        var adjectives = [
            "Flying",
            "Haunted",
            "Heavy",
            "Electric",
            "Diesel",
            "Daylight",
            "Outback",
            "Overland",
            "Underground",
            "Western",
            "Golden",
            "Awkward",
            "Livid",
            "Courageous",
            "Timid",
            "Nervous",
            "Emotional",
            "Ferocious",
            "Moronic",
            "Cynical",
            "Sassy",
            "Reluctant",
            "Majestic"
        ];
        var names = [
            "Gary",
            "Steve",
            "Paul",
            "George",
            "Scotsman",
            "Express",
            "Wanderer",
            "Locomotive",
            "Warrior",
            "Alfonse"
        ];
        function getRandomName() {
            return "The " + getRandomElement(adjectives) + " " + getRandomElement(names);
        }
        util.getRandomName = getRandomName;
        function getRandomElement(items) {
            return items[Math.floor(Math.random() * items.length)];
        }
        function toBoolean(value) {
            if (value === "true")
                return true;
            return false;
        }
        util.toBoolean = toBoolean;
        function selectButton($button) {
            var $parent = $button.closest('ul');
            $parent.find('button.selected').removeClass('selected');
            $button.addClass('selected');
        }
        util.selectButton = selectButton;
    })(util = trains.util || (trains.util = {}));
})(trains || (trains = {}));
