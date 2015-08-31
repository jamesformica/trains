module trains.audio {

	export class Player {

		private muted: boolean = false;
		private basePath: string = "audio/";

		constructor() {
		}

		setMuted(mute: boolean): void {
			this.muted = mute;
		}

		playSound(sound: trains.audio.Sound): void {
			if (!this.muted) {
				var fileName: string;
				switch (sound) {
					case trains.audio.Sound.click: {
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
		}

	}

	export enum Sound {
		click
	}

}