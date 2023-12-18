import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { keys, sounds } from "../../../globals.js";

export default class PlayerSwordSwingingState extends State {
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
        
		this.animation = new Animation([0,1,2,3,4,5,6], 0.1);
	}

	enter() {
		
		this.player.sprites = Player.generateSpritesSwordSwinging()
        this.player.currentAnimation = this.animation;
       
     
	}


	update() {

		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();


		if (this.player.currentAnimation.getCurrentFrame() == 6) {
			this.player.currentAnimation.refresh();

			this.player.changeState(PlayerStateName.SwordIdle);
		}

        this.player.checkObjectCollisions(object => this.onObjectCollision(object));
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}

    
	onObjectCollision(object) {
		if (object.didCollideWithEntity(this.player)) {
			if (object.isSolid) {
				object.onCollision(this.player);

			}
			else if (object.isConsumable) {
				object.onConsume(this.player);
			}
		}
	}
}
