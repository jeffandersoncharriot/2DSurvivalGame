import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import WoodCutter from "../../../entities/WoodCutter.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";

export default class WoodCutterChasingState extends State {
	/**
	 * In this state, the WoodCutter follows the player
	 * at a higher move speed and animation speed.
	 *
	 * @param {WoodCutter} woodCutter
	 * @param {Player} player
	 */
	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.animation = new Animation([0,1,2,3,4,5], 0.25);
	}

	enter() {
		this.woodCutter.currentAnimation = this.animation;
	}

	update(dt) {
		if (this.woodCutter.isDead) {
			return
		}

		this.decideDirection();
		this.move(dt);
	}

	/**
	 * Set the direction of the WoodCutter based on the distance of the player.
	 */
	decideDirection() {
		if (this.woodCutter.getDistanceBetween(this.player) > WoodCutter.CHASE_DISTANCE) {
			this.woodCutter.changeState(EnemyStateName.Moving);
		}
		else if (this.player.position.x < this.woodCutter.position.x) {
			this.woodCutter.direction = Direction.Left;
		}
		else {
			this.woodCutter.direction = Direction.Right;
		}
	}

	move(dt) {
		if (this.woodCutter.direction === Direction.Left && !this.woodCutter.isCollisionLeft()) {
			this.woodCutter.position.x -= this.woodCutter.velocityLimit.x * dt;
		}
		else if (this.woodCutter.direction === Direction.Right && !this.woodCutter.isCollisionRight()) {
			this.woodCutter.position.x += this.woodCutter.velocityLimit.x * dt;
		}
	}
}
