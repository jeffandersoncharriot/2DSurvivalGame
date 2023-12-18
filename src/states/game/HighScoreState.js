import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
} from "../../globals.js";
import HighScoreManager from "./HighScoreManager.js";
import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";

/**
 * Represents the screen where we can view all high scores previously recorded.
 */
export default class HighScoreState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.highScores = HighScoreManager.loadHighScores();
	}

	update(dt) {
		// Return to the start screen if we press escape.
		if (keys.Escape) {
			keys.Escape = false;
			sounds.play(SoundName.Kill)
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {

		context.save();
		context.fillStyle = "white";
		context.font = "15px Joystix";
		context.textAlign = 'center';
		context.fillText(`HIGH SCORE`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);

		for (let i = 0; i < 1; i++) {

			const score = this.highScores[i].score ?? '---';

			context.textAlign = 'center';
			context.fillText(`${score}`, CANVAS_WIDTH * 0.5, 75 + i * 15);

		}

		context.font = "30px Butterscotch";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.85);
		context.restore();
	}
}
