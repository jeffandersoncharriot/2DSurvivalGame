import Entity from "./Entity.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import { images } from "../globals.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import Vector from "../../lib/Vector.js";
import Level from "../objects/Level.js";
import Player from "./Player.js";
import GraveRobberIdleState from "../states/entity/graverobber/GraveRobberIdleState.js";
import GraveRobberMovingState from "../states/entity/graverobber/GraveRobberMovingState.js";
import GraveRobberChasingState from "../states/entity/graverobber/GraveRobberChasingState.js";
import GraveRobberDyingState from "../states/entity/graverobber/GraveRobberDyingState.js";
import GraveRobberHurtState from "../states/entity/graverobber/GraveRobberHurtState.js";
import GraveRobberFallingState from "../states/entity/graverobber/GraveRobberFallingState.js";


export default class GraveRobber extends Entity {
	static WIDTH = 32;
	static EXTRA_WIDTH = 48
	static HEIGHT = 32;
	static TOTAL_SPRITES = 6;
	static TOTAL_SPRITES_HURT = 3
	static TOTAL_SPRITES_CHASE = 6
	static CHASE_DISTANCE = 5 * GraveRobber.WIDTH;
	static VELOCITY_LIMIT = 60;
	static POINTS = 25;
	static OFFSET = 16

	/**
	 * An enemy that can kill the player on contact. Has decision-making
	 * abilities that allow it to move around in the level and chase the
	 * player if the player gets within range.
	 *
	 * @param {Vector} dimensions The height and width of the GraveRobber.
	 * @param {Vector} position The x and y coordinates of the GraveRobber.
	 * @param {Vector} velocityLimit The maximum speed of the GraveRobber.
	 * @param {Level} level The level that the GraveRobber lives in.
	 * @param {Player} player The player character the GraveRobber is trying to kill.
	 */
	constructor(dimensions, position, velocityLimit, level, player) {
		super(dimensions, position, velocityLimit, level);

		this.sprites = GraveRobber.generateSprites(ImageName.GraveRobberIdle, GraveRobber.TOTAL_SPRITES);
		this.gravityForce = new Vector(0, 1000);
		this.stateMachine = new StateMachine();
		this.stateMachine.add(EnemyStateName.Idle, new GraveRobberIdleState(this, player));
		this.stateMachine.add(EnemyStateName.Moving, new GraveRobberMovingState(this, player));
		this.stateMachine.add(EnemyStateName.Chasing, new GraveRobberChasingState(this, player));
		this.stateMachine.add(EnemyStateName.Dying, new GraveRobberDyingState(this, player));
		this.stateMachine.add(EnemyStateName.Hurt, new GraveRobberHurtState(this, player));
		this.stateMachine.add(EnemyStateName.Falling, new GraveRobberFallingState(this, player))

		this.changeState(EnemyStateName.Idle);



		this.position.y -= GraveRobber.OFFSET
		this.health = 2
	}

	static generateSprites(imageName, totalSprites,width = GraveRobber.WIDTH) {
		const sprites = [];

		for (let i = 0; i < totalSprites; i++) {
			sprites.push(new Sprite(
				images.get(imageName),
				(i * 48),
				16,
				width,
				GraveRobber.HEIGHT,
			));
		}

		return sprites;
	}

	static generateFallingSprites() {
		const sprites = [];

		for (let i = 0; i < 6; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.GraveRobberJump),
				(i * 48),
				16,
				GraveRobber.WIDTH,
				GraveRobber.HEIGHT + 16,
			));
		}

		return sprites;
	}






	isCollisionRight() {
		if (this.position.x > this.level.tilemap.canvasDimensions.x - this.dimensions.x) {
			return true;
		}


		const tilesToCheck = this.getTilesByDirection([Direction.Right, Direction.RightBottom]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		if (tilesToCheck[1] != null && !tilesToCheck[1].isCollidable() && doTilesExist) {
			this.changeState(EnemyStateName.Falling)
		}

		return doTilesExist && (tilesToCheck[0].isCollidable() || !tilesToCheck[1].isCollidable());
	}

	isCollisionLeft() {
		if (this.position.x < 0) {
			return true;
		}

		const tilesToCheck = this.getTilesByDirection([Direction.Left, Direction.LeftBottom]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);


		if (tilesToCheck[1] != null && !tilesToCheck[1].isCollidable() && doTilesExist) {
			this.changeState(EnemyStateName.Falling)
		}




		return doTilesExist && (tilesToCheck[0].isCollidable() || !tilesToCheck[1].isCollidable());
	}



	update(dt) {
		super.update(dt)

		if (this.health == 0) {
			
			this.changeState(EnemyStateName.Dying)
		}

	}

	getTilesByDirection(tileDirections) {
		const tiles = []

		tileDirections.forEach((direction) => {
			let x = 0;
			let y = 0;

			switch (direction) {
				case Direction.Right:
					x = this.position.x + this.dimensions.x;
					y = this.position.y;
					break;
				case Direction.RightBottom:
					x = this.position.x
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.LeftBottom:
					x = this.position.x + 28;
					y = this.position.y + this.dimensions.y
					break;
				case Direction.Left:
					x = this.position.x;
					y = this.position.y;
					break;
					
			}


			const tile = this.level.tilemap.pointToTile(x, y);

			tiles.push(tile);
		});

		return tiles;
	}

}
