import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import GraveRobber from "../../../entities/GraveRobber.js";
import SoundName from "../../../enums/SoundName.js";
import { context, sounds } from "../../../globals.js";
import Animation from "../../../../lib/Animation.js";
import ImageName from "../../../enums/ImageName.js";

export default class GraveRobberDyingState extends State {
	/**
	 * In this state, the GraveRobber disappears and generates
	 * an array of particles as its death animation.
	 *
	 * @param {GraveRobber} GraveRobber
	 * @param {Player} player
	 */
	constructor(graveRobber, player) {
		super();

		this.graveRobber = graveRobber;
		this.player = player;
		this.particles = [];
		this.animation = new Animation([0, 1, 2, 3, 4, 5], 0.1);
	}

	enter() {

		this.graveRobber.sprites = GraveRobber.generateSprites(ImageName.GraveRobberDeath, GraveRobber.TOTAL_SPRITES,GraveRobber.EXTRA_WIDTH)
		this.graveRobber.currentAnimation = this.animation;

		for (let i = 0; i < 20; i++) {
			this.particles.push(new Particle(
				this.graveRobber.position.x + this.graveRobber.dimensions.x / 2,
				this.graveRobber.position.y + this.graveRobber.dimensions.y / 2,
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


		if (this.graveRobber.currentAnimation.getCurrentFrame() == 5) {

			sounds.play(SoundName.WomanDeath);
			sounds.play(SoundName.Kill2);
			this.player.score += GraveRobber.POINTS;

			this.graveRobber.isDead = true
			this.graveRobber.cleanUp = true;

		}


		this.particles = this.particles.filter((particle) => particle.isAlive);

	}

	render() {
		this.particles.forEach((particle) => {
			particle.render(context);
		});
	}
}
