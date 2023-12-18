import GameObject from "./GameObject.js";
import Coin from "./Sword.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import SnailStateName from "../enums/EnemyStateName.js";
import WoodCutterStateName from "../enums/EnemyStateName.js";
import EnemyStateName from "../enums/EnemyStateName.js";

export default class Ammo extends GameObject {
	static WIDTH = 16;
	static HEIGHT = 16;
	static TOTAL_SPRITES = 1;
	static AMMO_DAMAGE = 5
	static SPEED = 5

	/**
	 * A "box" that the player can hit from beneath to reveal a coin.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, direction) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Ammo.generateSprites();


		this.direction = direction

		this.cleanUp = false

	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Ammo.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Ammo),
				0,
				Ammo.HEIGHT + (128 + 32),
				Ammo.WIDTH,
				Ammo.HEIGHT
			));
		}

		return sprites;
	}

	update(dt) {
		super.update(dt)

		if (this.direction == Direction.Right) {
			this.position.x += Ammo.SPEED
		}
		else {
			this.position.x -= Ammo.SPEED
		}
	}

	onCollision(collider) {
		if (this.wasCollided) {
			//sounds.play(SoundName.EmptyAmmo);
			return;
		}

		super.onCollision(collider);

		collider.changeState(EnemyStateName.Hurt,{damage:Ammo.AMMO_DAMAGE})
		this.cleanUp = true
	}
}
