import GameObject from "./GameObject.js";
import Sword from "./Sword.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import Gun from "./Gun.js";

export default class Chest extends GameObject {
	static WIDTH = 32;
	static HEIGHT = 24;
	static TOTAL_SPRITES = 4;
	static NOT_HIT = 1;
	static HIT = 2;

	/**
	 * A "box" that the player can hit from beneath to reveal a Sword.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true
		this.isSolid = true

		this.sprites = Chest.generateSprites();
		this.currentFrame = Chest.NOT_HIT;
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Chest.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Chest),
				8+(y-1)*48,
				8,
				Chest.WIDTH,
				Chest.HEIGHT
			));
		}

		return sprites;
	}

	onCollision(collider) {
		if (this.wasCollided) {
			sounds.play(SoundName.EmptyChest);
			return;
		}

		if (!(collider instanceof Player)) {
			return
		}

		super.onCollision(collider);

		if (Math.random() < 0.5) {
			const gun = new Gun(
				new Vector(Gun.WIDTH, Gun.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);

			// Make the Chest move up and down.
			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});

			// Make the Sword move up from the Chest and play a sound.
			timer.tween(gun.position, ['y'], [this.position.y - Gun.HEIGHT], 0.1);
			sounds.play(SoundName.Chest);

			/**
			 * Since we want the Sword to appear like it's coming out of the Chest,
			 * We add the Sword to the beginning of the objects array. This way,
			 * when the objects are rendered, the Swords will be rendered first,
			 * and the Chests will be rendered after.
			 */
			collider.level.objects.unshift(gun);

		}
		else {




			const sword = new Sword(
				new Vector(Sword.WIDTH, Sword.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);


			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});


			timer.tween(sword.position, ['y'], [this.position.y - Sword.HEIGHT], 0.1);
			sounds.play(SoundName.Chest);

			collider.level.objects.unshift(sword);
		}
		this.currentFrame = Chest.HIT;
	}

	
}
