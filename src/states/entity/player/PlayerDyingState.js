import Particle from "../../../../lib/Particle.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import SoundName from "../../../enums/SoundName.js";
import { context, sounds } from "../../../globals.js";
import Animation from "../../../../lib/Animation.js";
import ImageName from "../../../enums/ImageName.js";

export default class PlayerDyingState extends State {
    /**
     * In this state, the player disappears and generates
     * an array of particles as its death animation.
     *
     * @param {player} player
     * @param {Player} player
     */
    constructor(player) {
        super();

        this.player = player;
        this.particles = [];
        this.animation = new Animation([0, 1, 2, 3, 4, 5,6,7,8,9], 0.3);
    }

    enter() {

        sounds.play(SoundName.Kill);


        this.player.sprites = Player.generateDeathSprites()
        this.player.currentAnimation = this.animation;

    }

    update(dt) {
      this.player.velocity.x = 0
      this.player.velocity.y = 0
        if (this.player.currentAnimation.getCurrentFrame() == 9) {
            sounds.play(SoundName.Lose)
            this.player.isDead = true
        }
    }


}
