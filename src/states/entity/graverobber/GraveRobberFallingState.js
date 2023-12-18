import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import ImageName from "../../../enums/ImageName.js";
import { CANVAS_HEIGHT, keys } from "../../../globals.js";
import Direction from "../../../enums/Direction.js";

export default class GraveRobberFallingState extends State {
	/**
	 * In this state, the GraveRobber does not move and
	 * goes in its shell for a random period of time.
	 *
	 * @param {GraveRobber} GraveRobber
	 * @param {Player} player
	 */
	constructor(graveRobber, player) {
		super();

		this.graveRobber = graveRobber;
		this.player = player;
		this.animation = new Animation([3, 4, 5], 0.1);

	}


	enter() {
		this.graveRobber.currentAnimation = this.animation;
		this.graveRobber.sprites = GraveRobber.generateFallingSprites()

	}





	update(dt) {
		this.graveRobber.velocity.add(this.graveRobber.gravityForce, dt);



		if (this.graveRobber.position.y > CANVAS_HEIGHT) {
			this.graveRobber.isDead = true;
		}

		if (this.graveRobber.position.y >= 191 && this.graveRobber.position.y <= 194) {
			this.graveRobber.velocity.y = 0
			this.graveRobber.changeState(EnemyStateName.Idle)

		}

		if (this.graveRobber.isDead) {
			this.graveRobber.changeState(EnemyStateName.Dying);
		}


	}





}
