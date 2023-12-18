import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
} from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";

export default class StartState extends State {
	static FIRST_LEVEL = 1

	constructor() {
		super();

		this.level = LevelMaker.generateLevel();

		this.menuOptions = {
			start: 'Start',
			highScores: 'High Scores',
		};
		// Whether we're highlighting "Start" or "High Scores".
		this.highlighted = this.menuOptions.start;


		this.player = new Player(
			new Vector(Player.WIDTH, Player.HEIGHT),
			new Vector(Player.WIDTH, 0),
			new Vector(Player.VELOCITY_LIMIT, Player.VELOCITY_LIMIT),
			this.level,
		);

		this.player.levelNum = 0

		LevelMaker.generateEnemies(this.level, this.player, this.chance(1));
	}

	// level of difficulty
	chance(num) {
		switch (num) {
			case 1:
				return 0.1

			case 2:
				return 0.2

			case 3:
				return 0.3
// if player is higher than level 3 than puts highest again
				default:
					return 0.3
		}
	}

	enter(parameters) {
		if(parameters!=null)
		{

		

		this.player = parameters.player

		

		this.level = LevelMaker.generateLevel();
		this.player.position = new Vector(Player.WIDTH, 0)
		this.player.level = this.level
		this.menuOptions = {
			start: 'Next Round',
			highScores: 'High Scores',
		};
		// Whether we're highlighting "Start" or "High Scores".
		this.highlighted = this.menuOptions.start;


		LevelMaker.generateEnemies(this.level, this.player, this.chance(this.player.levelNum));

	}
	else
	{
		this.level = LevelMaker.generateLevel();

		this.menuOptions = {
			start: 'Start',
			highScores: 'High Scores',
		};
		// Whether we're highlighting "Start" or "High Scores".
		this.highlighted = this.menuOptions.start;


		this.player = new Player(
			new Vector(Player.WIDTH, Player.HEIGHT),
			new Vector(Player.WIDTH, 0),
			new Vector(Player.VELOCITY_LIMIT, Player.VELOCITY_LIMIT),
			this.level,
		);

		this.player.levelNum = 0

		LevelMaker.generateEnemies(this.level, this.player, this.chance(StartState.FIRST_LEVEL));
	}

	}

	update() {
		// Toggle highlighted option if we press w or s.
		if (keys.w || keys.s) {
			keys.w = false;
			keys.s = false;
			this.highlighted = this.highlighted === this.menuOptions.start ? this.menuOptions.highScores : this.menuOptions.start;

		}

		// Confirm whichever option we have selected to change screens.

		if (keys.Enter) {
			keys.Enter = false;
			sounds.play(SoundName.Kill)

			if (this.highlighted === this.menuOptions.start) {
			
				
				stateMachine.change(GameStateName.Play, {
					level: this.level,
					player: this.player,
				});
				
			}
			else {
				stateMachine.change(GameStateName.HighScore);
			}
		}

	}

	render() {
		this.level.render();

		this.renderTitleWindow();
	}

	renderTitleWindow() {
		context.save();
		context.fillStyle = 'rgb(0,0,0, 0.5)';
		context.font = '40px Butterscotch';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('SURVIVAL', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);
		context.font = '30px SanAndreas';
		// Set the fill style based on which option is highlighted.
		context.fillStyle = this.highlighted === this.menuOptions.start ? "red" : "white";
		context.fillText(`${this.menuOptions.start}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.7);
		context.fillStyle = this.highlighted === this.menuOptions.highScores ? "black" : "white";
		context.fillText(`${this.menuOptions.highScores}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.85);
		context.restore();
	}
}
