import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import ImageName from "../../../enums/ImageName.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds } from "../../../globals.js";

export default class PlayerHurtState extends State {

	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0,1,2,3], 0.1);
        
	}

	enter() {
       sounds.play(SoundName.Hurt)
		this.player.health--
        
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		this.player.currentAnimation = this.animation;

        this.player.sprites = Player.generateSprites(ImageName.CharacterHurt,Player.TOTAL_SPRITES_HURT)


		if(this.player.health<=0)
		{
          
			this.player.changeState(PlayerStateName.Death)
		}
      
	}



	update() {

		if (this.player.isDead) {
			this.player.changeState(PlayerStateName.Death);
		}

if(this.player.currentAnimation.getCurrentFrame() == 3)
{
    this.player.currentAnimation.refresh()

	if(this.player.hasSword)
	{
		this.player.changeState(PlayerStateName.SwordIdle)
	}
	else if(this.player.hasGun)
	{
		this.player.changeState(PlayerStateName.GunIdle)
	}
	else
	{
    this.player.changeState(PlayerStateName.Idle)
	}
}

	}


}
