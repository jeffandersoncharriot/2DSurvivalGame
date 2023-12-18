import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import WoodCutter from "../../../entities/WoodCutter.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import ImageName from "../../../enums/ImageName.js";

export default class WoodCutterHurtState extends State {
	/**
	 * In this state, the WoodCutter does not move and
	 * goes in its shell for a random period of time.
	 *
	 * @param {WoodCutter} WoodCutter
	 * @param {Player} player
	 */
	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.animation = new Animation([0,1,2], 0.1);
        
	}

	enter(parameters) {
		this.woodCutter.health-=parameters.damage
		this.idleDuration = getRandomPositiveInteger(2, 5);
		this.woodCutter.currentAnimation = this.animation;
        this.woodCutter.sprites = WoodCutter.generateSprites(ImageName.WoodCutterHurt,WoodCutter.TOTAL_SPRITES_HURT)

		if(this.woodCutter.health<=0)
		{
			this.woodCutter.changeState(EnemyStateName.Dying)
		}
	}



	update() {
		if (this.woodCutter.isDead) {
			this.woodCutter.changeState(EnemyStateName.Dying);
		}
        
if(this.woodCutter.currentAnimation.getCurrentFrame() == 2)
{
    this.woodCutter.currentAnimation.refresh()
    this.woodCutter.changeState(EnemyStateName.Idle)
}

	}


}
