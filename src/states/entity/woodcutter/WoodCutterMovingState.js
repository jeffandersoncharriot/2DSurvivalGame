import Animation from "../../../../lib/Animation.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import WoodCutter from "../../../entities/WoodCutter.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";

export default class WoodCutterMovingState extends State {
	/**
	 * In this state, the WoodCutter moves at a slower speed
	 * and can randomly decide to go idle or change directions.
	 *
	 * @param {WoodCutter} WoodCutter
	 * @param {Player} player
	 */
	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.animation = new Animation([0,1,2,3,4,5], 1);

		this.reset();
	}

	enter() {
		this.woodCutter.currentAnimation = this.animation;

		this.reset();
		this.startTimer();
	}

	exit() {
		this.timerTask?.clear();
	}

	update(dt) {
		if (this.woodCutter.isDead) {
			return
		}

		this.move(dt);
		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	move(dt) {
		if (this.woodCutter.direction === Direction.Left) {
			this.woodCutter.position.x -= this.woodCutter.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the left or no tile on the bottom left.
			if (this.woodCutter.isCollisionLeft()) {
				this.woodCutter.direction = Direction.Right;
			}
		}
		else {
			this.woodCutter.position.x += this.woodCutter.velocityLimit.x / 2 * dt;

			// Stop if there's a tile to the right or no tile on the bottom right.
			if (this.woodCutter.isCollisionRight()) {
				this.woodCutter.direction = Direction.Left;
			}
		}
	}

	/**
	 * 50% chance for the WoodCutter to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedChance(0.5)) {
			this.woodCutter.changeState(EnemyStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * Calculate the difference between WoodCutter and player
	 * and only chase if <= CHASE_DISTANCE tiles.
	 */
	chase() {
		if (this.woodCutter.getDistanceBetween(this.player) <= WoodCutter.CHASE_DISTANCE) {
			this.woodCutter.changeState(EnemyStateName.Chasing);
		}
	}

	/**
	 * 50% chance for the WoodCutter to move either left or right.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.woodCutter.direction = didSucceedChance(0.5) ? Direction.Left : Direction.Right;
		this.moveDuration = getRandomPositiveInteger(2, 5);
	}
}
