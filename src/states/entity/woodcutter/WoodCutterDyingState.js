import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import WoodCutter from "../../../entities/WoodCutter.js";
import SoundName from "../../../enums/SoundName.js";
import { context, sounds } from "../../../globals.js";
import Animation from "../../../../lib/Animation.js";
import ImageName from "../../../enums/ImageName.js";

export default class WoodCutterDyingState extends State {
	/**
	 * In this state, the WoodCutter disappears and generates
	 * an array of particles as its death animation.
	 *
	 * @param {WoodCutter} WoodCutter
	 * @param {Player} player
	 */
	constructor(woodCutter, player) {
		super();

		this.woodCutter = woodCutter;
		this.player = player;
		this.particles = [];
		this.animation = new Animation([0, 1, 2, 3, 4, 5], 0.1);
	}

	enter() {




		this.woodCutter.sprites = WoodCutter.generateSprites(ImageName.WoodCutterDeath, WoodCutter.TOTAL_SPRITES,WoodCutter.EXTRA_WIDTH)
		this.woodCutter.currentAnimation = this.animation;

		



		for (let i = 0; i < 20; i++) {
			this.particles.push(new Particle(
				this.woodCutter.position.x + this.woodCutter.dimensions.x / 2,
				this.woodCutter.position.y + this.woodCutter.dimensions.y / 2,
				{ r: 255, g: 0, b: 0 },
				2,
				100
			));
		}

	}

	update(dt) {


		this.particles.forEach((particle) => {
			particle.update(dt);
		});



		if (this.woodCutter.currentAnimation.getCurrentFrame() == 5) {
			sounds.play(SoundName.ManDeath);
			sounds.play(SoundName.Kill2);
			this.player.score += WoodCutter.POINTS;
			this.woodCutter.isDead = true
			this.woodCutter.cleanUp = true;

		}


		this.particles = this.particles.filter((particle) => particle.isAlive);

		/*
		if (this.particles.length === 0) {
			this.woodCutter.cleanUp = true;
		}
		*/

	}

	render() {
		this.particles.forEach((particle) => {
			particle.render(context);
		});
	}
}
