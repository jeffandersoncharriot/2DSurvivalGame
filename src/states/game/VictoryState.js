import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine
} from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";
import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";


export default class VictoryState extends State {
	constructor() {
		super();

	}

	enter(parameters) {

		this.level = parameters.level
		this.player = parameters.player
		this.player.levelNum++
	}

	update(dt) {


		

		if (keys.Enter) {
			keys.Enter = false;


			stateMachine.change(GameStateName.TitleScreen,{
				player: this.player,
				start:'Next Round'
			})

		}
	
	}

	render() {
		context.save();

		this.level.render();

		context.fillStyle = "white";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.font = "20px Joystix";
		context.fillText(`Level ${this.player.levelNum} Complete!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.6);
		context.fillText(`Press Enter to continue...`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.7);
		context.restore();

	}
}
