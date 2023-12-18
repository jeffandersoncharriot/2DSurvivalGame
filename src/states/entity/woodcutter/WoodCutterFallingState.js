import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import ImageName from "../../../enums/ImageName.js";
import { CANVAS_HEIGHT, keys } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";
import WoodCutter from "../../../entities/WoodCutter.js";

export default class woodCutterFallingState extends State {
	/**
	 * In this state, the woodCutter does not move and
	 * goes in its shell for a random period of time.
	 *
	 * @param {woodCutter} woodCutter
	 * @param {Player} player
	 */
	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.animation = new Animation([3, 4, 5], 0.1);

	}


	enter() {
		this.woodCutter.currentAnimation = this.animation;
		this.woodCutter.sprites = WoodCutter.generateFallingSprites()

	}





	update(dt) {
		this.woodCutter.velocity.add(this.woodCutter.gravityForce, dt);



		if (this.woodCutter.position.y > CANVAS_HEIGHT) {
			this.woodCutter.isDead = true;
		}

		if (this.woodCutter.position.y >= 191 && this.woodCutter.position.y <= 194) {
			this.woodCutter.velocity.y = 0
			this.woodCutter.changeState(EnemyStateName.Idle)

		}

		if (this.woodCutter.isDead) {
			this.woodCutter.changeState(EnemyStateName.Dying);
		}


	}





}
