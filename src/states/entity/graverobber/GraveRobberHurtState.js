import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import ImageName from "../../../enums/ImageName.js";

export default class GraveRobberHurtState extends State {
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
		this.animation = new Animation([0,1,2], 0.1);
        
	}

	enter(parameters) {
		this.graveRobber.health-=parameters.damage
		this.idleDuration = getRandomPositiveInteger(2, 5);
		this.graveRobber.currentAnimation = this.animation;
        this.graveRobber.sprites = GraveRobber.generateSprites(ImageName.GraveRobberHurt,GraveRobber.TOTAL_SPRITES_HURT)

		if(this.graveRobber.health<=0)
		{
			this.graveRobber.changeState(EnemyStateName.Dying)
		}
	}



	update() {
		if (this.graveRobber.isDead) {
			this.graveRobber.changeState(EnemyStateName.Dying);
		}
        
if(this.graveRobber.currentAnimation.getCurrentFrame() == 2)
{
    this.graveRobber.currentAnimation.refresh()
    this.graveRobber.changeState(EnemyStateName.Idle)
}

	}


}
