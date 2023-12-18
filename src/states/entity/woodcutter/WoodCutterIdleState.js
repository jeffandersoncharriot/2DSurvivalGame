import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import WoodCutter from "../../../entities/WoodCutter.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import ImageName from "../../../enums/ImageName.js";
import { timer } from "../../../globals.js";

export default class WoodCutterIdleState extends State {


	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.animation = new Animation([3], 2);
	}

	enter() {
		this.woodCutter.sprites =  WoodCutter.generateSprites(ImageName.WoodCutterWalk,WoodCutter.TOTAL_SPRITES);
		this.idleDuration = getRandomPositiveInteger(2, 5);
		this.woodCutter.currentAnimation = this.animation;
		this.startTimer();
	}

	exit() {
		this.timerTask?.clear();
	}

	update() {
		if (this.woodCutter.isDead) {
			return
		}

		this.chase();
	}

	startTimer() {
		this.timerTask = timer.wait(this.idleDuration, () => this.woodCutter.changeState(EnemyStateName.Moving));
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
}
