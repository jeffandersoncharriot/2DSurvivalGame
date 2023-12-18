import Animation from "../../../../lib/Animation.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import ImageName from "../../../enums/ImageName.js";

export default class GraveRobberMovingState extends State {
	/**
	 * In this state, the GraveRobber moves at a slower speed
	 * and can randomly decide to go idle or change directions.
	 *
	 * @param {GraveRobber} GraveRobber
	 * @param {Player} player
	 */
	constructor(graveRobber, player) {
		super();

		this.graveRobber = graveRobber;
		this.player = player;
		this.animation = new Animation([0,1,2,3,4,5], 0.2);

		this.reset();
	}

	enter() {
		
		this.graveRobber.currentAnimation = this.animation;
		this.graveRobber.sprites = GraveRobber.generateSprites(ImageName.GraveRobberWalk,GraveRobber.TOTAL_SPRITES_CHASE)
		this.reset();
		this.startTimer();
	}

	exit() {
		this.timerTask?.clear();
	}

	update(dt) {
		if (this.graveRobber.isDead) {
			this.graveRobber.changeState(EnemyStateName.Dying);
		}

		this.move(dt);
		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	move(dt) {
		if (this.graveRobber.direction === Direction.Left) {
			this.graveRobber.position.x -= this.graveRobber.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the left or no tile on the bottom left.
			if (this.graveRobber.isCollisionLeft()) {
				this.graveRobber.direction = Direction.Right;
			}
		}
		else {
			this.graveRobber.position.x += this.graveRobber.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the right or no tile on the bottom right.
			if (this.graveRobber.isCollisionRight()) {
				this.graveRobber.direction = Direction.Left;
			}
		}
	}

	/**
	 * 50% chance for the GraveRobber to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedChance(0.5)) {
			this.graveRobber.changeState(EnemyStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * Calculate the difference between GraveRobber and player
	 * and only chase if <= CHASE_DISTANCE tiles.
	 */
	chase() {
		if (this.graveRobber.getDistanceBetween(this.player) <= GraveRobber.CHASE_DISTANCE) {
			this.graveRobber.changeState(EnemyStateName.Chasing);
		}
	}

	/**
	 * 50% chance for the GraveRobber to move either left or right.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.graveRobber.direction = didSucceedChance(0.5) ? Direction.Left : Direction.Right;
		this.moveDuration = getRandomPositiveInteger(2, 5);
	}
}
