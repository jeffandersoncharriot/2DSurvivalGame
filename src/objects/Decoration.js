import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Decoration extends GameObject {
	static WIDTH = 48;
	static HEIGHT = 32;
	static TOTAL_SPRITES = 2;
	static OFFSET = 16

	/**
	 * A background asset that does not have any behaviour.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.sprites = Decoration.generateSprites();

		this.currentFrame = getRandomPositiveInteger(0, Decoration.TOTAL_SPRITES - 1);


		if(this.currentFrame == 1)
		{
			this.position.y +=Decoration.OFFSET
		}
	}

	static generateSprites() {
		const sprites = [];

		sprites.push(new Sprite(
			images.get(ImageName.Map),
			112,
			80,
			Decoration.HEIGHT,
			Decoration.WIDTH
		));

		sprites.push(new Sprite(
			images.get(ImageName.Map),
			80,
			80,
			Decoration.HEIGHT,
			Decoration.WIDTH
		));


		return sprites;
	}
}
