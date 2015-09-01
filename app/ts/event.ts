module trains.event {
	var globalEventID = 1;
	var globalEvents: trains.event.GlobalEvent = {};

	export function On(eventName: string, callback: (event: trains.event.GlobalEventObject, ...data: any[]) => void): number {
		var id = globalEventID;
		globalEventID++;

		var existingEvents = globalEvents[eventName];
		if (existingEvents === undefined) {
			globalEvents[eventName] = new Array<trains.event.StoredEvent>();
			existingEvents = globalEvents[eventName];
		}

		existingEvents.push({
			id: id,
			callback: callback
		});

		return id;
	}

	export function Emit(eventName: string, ...data: any[]): void {
		var existingEvents = globalEvents[eventName];
		if (existingEvents !== undefined) {

			var eventObject: trains.event.GlobalEventObject = {
				eventName: eventName,
				data: data
			};

			var callbackData: any[] = [eventObject];
			for (var i = 0; i < data.length; i++) {
				callbackData.push(data[i]);
			}

			for (var i = 0; i < existingEvents.length; i++) {
				existingEvents[i].callback.apply(null, callbackData);
			}
		}
	}

	export function Unsubscribe(eventID: number): void {
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

	export interface StoredEvent {
		id: number;
		callback: Function;
	}

	export interface GlobalEventObject {
		eventName: string;
		data: any[];
	}

	export interface GlobalEvent {
		[eventName: string]: Array<trains.event.StoredEvent>;
	}

}