import Entity from "./Entity.js";
import WoodCutterChasingState from "../states/entity/woodcutter/WoodCutterChasingState.js";
import WoodCutterDyingState from "../states/entity/woodcutter/WoodCutterDyingState.js";
import WoodCutterIdleState from "../states/entity/woodcutter/WoodCutterIdleState.js";
import WoodCutterMovingState from "../states/entity/woodcutter/WoodCutterMovingState.js";
import WoodCutterHurtState from "../states/entity/woodcutter/WoodCutterHurtState.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import { images } from "../globals.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import Vector from "../../lib/Vector.js";
import Level from "../objects/Level.js";
import Player from "./Player.js";
import WoodCutterFallingState from "../states/entity/woodcutter/WoodCutterFallingState.js";

export default class WoodCutter extends Entity {
	static WIDTH = 32
	static HEIGHT = 32
	static EXTRA_WIDTH = 48
	static TOTAL_SPRITES = 6;
	static TOTAL_SPRITES_HURT = 3
	static CHASE_DISTANCE = 5 * WoodCutter.WIDTH;
	static VELOCITY_LIMIT = 25;
	static POINTS = 25;
	static OFFSET =16

	/**
	 * An enemy that can kill the player on contact. Has decision-making
	 * abilities that allow it to move around in the level and chase the
	 * player if the player gets within range.
	 *
	 * @param {Vector} dimensions The height and width of the WoodCutter.
	 * @param {Vector} position The x and y coordinates of the WoodCutter.
	 * @param {Vector} velocityLimit The maximum speed of the WoodCutter.
	 * @param {Level} level The level that the WoodCutter lives in.
	 * @param {Player} player The player character the WoodCutter is trying to kill.
	 */
	constructor(dimensions, position, velocityLimit, level, player) {
		super(dimensions, position, velocityLimit, level);

		this.sprites = WoodCutter.generateSprites(ImageName.WoodCutterWalk,WoodCutter.TOTAL_SPRITES);
		this.gravityForce = new Vector(0, 1000);
		this.stateMachine = new StateMachine();
		this.stateMachine.add(EnemyStateName.Idle, new WoodCutterIdleState(this, player));
		this.stateMachine.add(EnemyStateName.Moving, new WoodCutterMovingState(this, player));
		this.stateMachine.add(EnemyStateName.Chasing, new WoodCutterChasingState(this, player));
		this.stateMachine.add(EnemyStateName.Dying, new WoodCutterDyingState(this, player));
		this.stateMachine.add(EnemyStateName.Hurt, new WoodCutterHurtState(this, player));
		this.stateMachine.add(EnemyStateName.Falling, new WoodCutterFallingState(this, player));
		this.changeState(EnemyStateName.Idle);


		this.position.y -= WoodCutter.OFFSET

		this.health = 4
	}

	static generateSprites(imageName,totalSprites,width = WoodCutter.WIDTH) {
		const sprites = [];

		for (let i = 0; i < totalSprites; i++) {
			sprites.push(new Sprite(
				images.get(imageName),
				(i * 48),
				16,
				width,
				WoodCutter.HEIGHT,
			));
		}

		return sprites;
	}

	
	static generateFallingSprites() {
		const sprites = [];

		for (let i = 0; i < 6; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.WoodCutterJump),
				(i * 48),
				16,
				WoodCutter.WIDTH,
				WoodCutter.HEIGHT + 16,
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

		if(this.isDead)
		{
			return
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
