import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import ImageName from "../../../enums/ImageName.js";

export default class GraveRobberChasingState extends State {
	/**
	 * In this state, the GraveRobber follows the player
	 * at a higher move speed and animation speed.
	 *
	 * @param {GraveRobber} GraveRobber
	 * @param {Player} player
	 */
	constructor(graveRobber, player) {
		super();

		this.graveRobber = graveRobber;
		this.player = player;
		this.animation = new Animation([0,1,2,3,4,5], 0.1);
	}

	enter() {
		this.graveRobber.sprites = GraveRobber.generateSprites(ImageName.GraveRobberRun,GraveRobber.TOTAL_SPRITES_CHASE)
		this.graveRobber.currentAnimation = this.animation;
	}

	update(dt) {
		if (this.graveRobber.isDead) {
			this.graveRobber.changeState(EnemyStateName.Dying);
		}

		this.decideDirection();
		this.move(dt);


	}

	/**
	 * Set the direction of the GraveRobber based on the distance of the player.
	 */
	decideDirection() {
		if (this.graveRobber.getDistanceBetween(this.player) > GraveRobber.CHASE_DISTANCE) {
			this.graveRobber.changeState(EnemyStateName.Moving);
		}
		else if (this.player.position.x < this.graveRobber.position.x) {
			this.graveRobber.direction = Direction.Left;
		}
		else {
			this.graveRobber.direction = Direction.Right;
		}
	}

	move(dt) {
		if (this.graveRobber.direction === Direction.Left && !this.graveRobber.isCollisionLeft()) {
			this.graveRobber.position.x -= this.graveRobber.velocityLimit.x * dt;
		}
		else if (this.graveRobber.direction === Direction.Right && !this.graveRobber.isCollisionRight()) {
			this.graveRobber.position.x += this.graveRobber.velocityLimit.x * dt;
		}
	}
}
