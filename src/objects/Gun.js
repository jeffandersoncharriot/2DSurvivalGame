import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds, timer } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import PlayerStateName from "../enums/PlayerStateName.js";

export default class Gun extends GameObject {
	static WIDTH = 32;
	static HEIGHT = 24;
	static TOTAL_SPRITES = 12;
	static POINTS = 10;
	static AMMOS = 10

	/**sw
	 * A collectible item that the player can consume to shoot
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Gun.generateSprites();
		this.animation = new Animation([0, 1, 2, 3, 4,5,6,7,8,9,10,11], 0.1);

		this.duration = 1.5
		this.delayPickup = false
	}

	update(dt) {
		this.animation.update(dt);
		this.currentFrame = this.animation.getCurrentFrame();
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
			player.score += Gun.POINTS;
			player.ammo= Gun.AMMOS
			this.cleanUp = true;

			player.changeState(PlayerStateName.GunIdle);
			player.hasGun = true
			player.hasSword = false

		}

	}

	static generateSprites() {
		const sprites = [];

        sprites.push(new Sprite(
            images.get(ImageName.Gun),
            0,
            8,
            Gun.WIDTH,
            Gun.HEIGHT
        ));


		for (let x = 1; x < Gun.TOTAL_SPRITES*2; x+=2) {
			sprites.push(new Sprite(
				images.get(ImageName.Gun),
				(x * Gun.WIDTH) + 32,
				8,
				Gun.WIDTH,
				Gun.HEIGHT
			));
		}

		return sprites;
	}
}
