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

/**
 * Screen that allows us to input a new high score in the form of three characters, arcade-style.
 */
export default class EnterHighScoreState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.score = parameters.score;
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			const name = "YOU"

			HighScoreManager.addHighScore(name, this.score);

			stateMachine.change(GameStateName.TitleScreen);
		}

	}

	render() {

		context.save();
		context.fillStyle = "white";
		context.font = "20px Joystix";
		context.textAlign = 'center';
		context.fillText(`Your high score: ${this.score}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.15);
		context.font = "50px Joystix";
		context.fillStyle = "white";
		context.font = "10px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Enter to confirm!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}
