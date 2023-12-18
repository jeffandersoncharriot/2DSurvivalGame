import Camera from "../../../lib/Camera.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	sounds,
	stateMachine,
	timer
} from "../../globals.js";
import UserInterface from "../../services/UserInterface.js"



export default class PlayState extends State {
	constructor() {
		super();
		
	}



	enter(parameters) {
	
		this.level = parameters.level;
		this.player = parameters.player;
		this.userInterface = new UserInterface(this.player)
	
		this.camera = new Camera(
			this.player,
			this.level.tilemap.canvasDimensions,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
		);

		this.level.addEntity(this.player);
		this.level.addCamera(this.camera);

		
		sounds.play(SoundName.BlackOps);

	}

	exit() {
		sounds.stop(SoundName.BlackOps);
	}

	update(dt) {
		this.level.update(dt);
		this.camera.update();

		if (this.player.isDead) {
			stateMachine.change(GameStateName.GameOver,{
				score:this.player.score
			});
		}
	}

	render() {
		this.renderViewport();
		this.renderScore();
		this.userInterface.render()
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.level.render();
		context.restore();
	}

	renderScore() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(context, 10, 10, 160, 30, 10, true, false);
		context.fillStyle = 'black';
		context.font = '16px Crima';
		context.textAlign = 'left';
		context.fillText(`Score:`, 20, 30);
		context.textAlign = 'right';
		context.fillText(`${String(this.player.score).padStart(5, '0')}`, 160, 30);
		context.restore();
	}
}
