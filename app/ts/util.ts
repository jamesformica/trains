/// <reference path="../types/jqueryui.d.ts" />

module trains.util {

	var adjectives: Array<string> = [
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

	var names: Array<string> = [
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

	export function getRandomName(): string {
		return "The " + getRandomElement(adjectives) + " " + getRandomElement(names);
	}

	function getRandomElement(items: Array<string>): string {
		return items[Math.floor(Math.random() * items.length)];
	}
	
	export function toBoolean(value: string): boolean {
		if (value === "true") return true;
		return false;
	}
	
	export function selectButton($button: JQuery): void {
		var $parent = $button.closest('ul');
		$parent.find('button.selected').removeClass('selected');
		$button.addClass('selected');
	}
}