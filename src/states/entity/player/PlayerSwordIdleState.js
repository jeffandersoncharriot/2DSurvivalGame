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

export default class PlayerSwordIdleState extends State {
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
        this.animation = new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.1);
    }

    enter() {
        this.player.currentAnimation = this.animation;
        this.player.sprites = Player.generateSprites(ImageName.SwordIdle,Player.SWORD_IDLE)
    }

    update() {
        this.player.checkLeftCollisions();
        this.player.checkRightCollisions();
        this.player.checkEntityCollisions();

        const collisionObjects = this.player.checkObjectCollisions();

        if (collisionObjects.length === 0 && !this.isTileCollisionBelow()) {
            this.player.changeState(PlayerStateName.Falling);
        }

        if (keys.e) {
            keys.e = false
            sounds.play(SoundName.Sword)
            this.player.changeState(PlayerStateName.SwordSwinging)
        }


        if (keys.a || keys.d) {
            this.player.changeState(PlayerStateName.SwordRunning);
        }

        if(keys.f)
		{
			keys.f = false

				
			this.player.changeState(PlayerStateName.Punching);
		}
        

        if (keys[' ']) {
            this.player.changeState(PlayerStateName.Jumping);
        }


    }

    isTileCollisionBelow() {
        return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
    }
}
