import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Vector from "../../../../lib/Vector.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import ImageName from "../../../enums/ImageName.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { keys, sounds } from "../../../globals.js";
import Ammo from "../../../objects/Ammo.js";
import Level from "../../../objects/Level.js";

export default class PlayerGunIdleState extends State {
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
		this.animation = new Animation([0,1], 0.1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
		this.player.sprites = Player.generateSprites(ImageName.GunIdleShoot,Player.GUN_SPRITES_IDLE,Player.WIDTH,Player.HEIGHT)
	}

	update() {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();

		const collisionObjects = this.player.checkObjectCollisions();

		if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}

        if(keys.e)
        {
            keys.e= false
			
            this.player.currentAnimation = new Animation([0,1,2,3,4,5,6,7,8,9],0.1)
            this.shooting=true

			this.player.shoot()
        }

        if (this.shooting && this.player.currentAnimation.getCurrentFrame() == 9 ) {
			
            
			this.player.currentAnimation = new Animation([0,1],0.1)
            this.player.currentAnimation.refresh();

            this.shooting =false
		}

		if (keys.a || keys.d) {
			this.player.changeState(PlayerStateName.GunRunningAiming);
		}

		if (keys[' ']) {
			this.player.changeState(PlayerStateName.Jumping);
		}

		if(keys.f)
		{
			keys.f = false

				
			this.player.changeState(PlayerStateName.Punching);
		}

		if (keys.e) {
			
			keys.e = false

				
			this.player.changeState(PlayerStateName.GunIdleShooting);
			this.player.shoot()
		}
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
