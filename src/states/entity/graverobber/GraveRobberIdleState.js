import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import ImageName from "../../../enums/ImageName.js";

export default class GraveRobberIdleState extends State {


	constructor(graveRobber, player) {
		super();

		this.graveRobber = graveRobber;
		this.player = player;
		this.animation = new Animation([0,1,2,3], 0.2);
	}

	enter() {
		this.idleDuration = getRandomPositiveInteger(2, 5);
		this.graveRobber.currentAnimation = this.animation;
		this.startTimer();
		this.graveRobber.sprites = GraveRobber.generateSprites(ImageName.GraveRobberIdle,GraveRobber.TOTAL_SPRITES)
	}

	exit() {
		this.timerTask?.clear();
	}

	update() {
		if (this.graveRobber.isDead) {
			this.graveRobber.changeState(EnemyStateName.Dying);
		}

		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.idleDuration, () => this.graveRobber.changeState(EnemyStateName.Moving));
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
}
