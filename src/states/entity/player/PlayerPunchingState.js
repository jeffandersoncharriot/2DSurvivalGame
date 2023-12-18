import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import ImageName from "../../../enums/ImageName.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { keys, sounds } from "../../../globals.js";

export default class PlayerPunchingState extends State {
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

		this.animation = new Animation([0, 1, 2, 3, 4, 5, 6], 0.1);
	}

	enter(parameters) {

		if (parameters != null && parameters.bigpunch) {

			this.player.sprites = Player.generateBigPunchSprites()
		}
		else {
			this.player.sprites = Player.generateSprites(ImageName.CharacterPunching, Player.TOTAL_SPRITES_JAB, Player.EXTRA_WIDTH)
		}
		this.player.currentAnimation = this.animation;

		sounds.play(SoundName.Punch)
	}


	update() {

		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();


		if (this.player.currentAnimation.getCurrentFrame() == 6) {
			this.player.currentAnimation.refresh();

			if (this.player.hasGun) {
				this.player.changeState(PlayerStateName.GunIdle);
			}
			else if (this.player.hasSword) {
				this.player.changeState(PlayerStateName.SwordIdle);
			}
			else {


				this.player.changeState(PlayerStateName.Idle);
			}
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
