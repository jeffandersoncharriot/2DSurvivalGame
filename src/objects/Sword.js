import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds, timer } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import PlayerStateName from "../enums/PlayerStateName.js";

export default class Sword extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 1;
	static POINTS = 10;
	static OFFSET =10

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Sword.generateSprites();

		this.duration = 1.5
		this.delayPickup = false

		this.position.x+=Sword.OFFSET
	}


	onConsume(player) {
		if (this.wasConsumed) {
			return;
		}



		if (!this.delayPickup) {
			this.timerTask = timer.wait(this.duration, () => {
				this.delayPickup = true
				return
			});
		}

		if (this.delayPickup) {
			super.onConsume();
			sounds.play(SoundName.PickUp);
			player.score += Sword.POINTS;
			this.cleanUp = true;
			
			player.changeState(PlayerStateName.SwordIdle);
			player.hasSword = true
			player.hasGun  = false
		}

	}

	static generateSprites() {
		const sprites = [];

		for (let x = 0; x < Sword.TOTAL_SPRITES; x++) {
			sprites.push(new Sprite(
				images.get(ImageName.Swords),
				Tile.SIZE+(x * Sword.WIDTH),
				0,
				Sword.WIDTH,
				Sword.HEIGHT
			));
		}

		return sprites;
	}
}
