import Entity from "./Entity.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { images, keys, sounds } from "../globals.js";
import Level from "../objects/Level.js";
import PlayerFallingState from "../states/entity/player/PlayerFallingState.js";
import PlayerIdleState from "../states/entity/player/PlayerIdleState.js";
import PlayerJumpingState from "../states/entity/player/PlayerJumpingState.js";
import PlayerRunningState from "../states/entity/player/PlayerRunningState.js";
import GameObject from "../objects/GameObject.js";
import PlayerPunchingState from "../states/entity/player/PlayerPunchingState.js";
import PlayerGunIdleState from "../states/entity/player/PlayerGunIdleState.js";
import PlayerRunningGunState from "../states/entity/player/PlayerRunningGunState.js";
import Ammo from "../objects/Ammo.js";
import PlayerSwordIdleState from "../states/entity/player/PlayerSwordIdleState.js";
import PlayerSwordRunningState from "../states/entity/player/PlayerSwordRunningState.js";
import PlayerSwordSwingingState from "../states/entity/player/PlayerSwordSwingingState.js";
import EntityStateName from "../enums/EnemyStateName.js";
import { timer } from "../globals.js";
import PlayerHurtState from "../states/entity/player/PlayerHurtState.js";
import PlayerDyingState from "../states/entity/player/PlayerDyingState.js";

export default class Player extends Entity {
	static WIDTH = 32;
	static EXTRA_WIDTH = 48
	static HEIGHT = 32;
	static BIG_PUNCH_SPRITES = 7
	static TOTAL_SPRITES_HURT = 4
	static SWORD_IDLE = 10
	static SWORD_RUNNING = 8
	static SWORD_BIG_ATTACK = 7
	static GUN_SPRITES_RUN = 8
	static GUN_SPRITES_IDLE = 10
	static SMALL_EXTRA_HEIGHT = 40
	static TOTAL_SPRITES = 10
	static TOTAL_SPRITES_IDLE = 10;
	static TOTAL_SPRITES_JUMPING = 3
	static TOTAL_SPRITES_JAB = 10
	static TOTAL_SPRITES_RUNNING = 8
	static VELOCITY_LIMIT = 100;
	static SWORD_DAMAGE = 3
	static PUNCH_DAMAGE = 1

	static MAX_HEALTH = 6;
	static BIG_PUNCH_COORDINATES = [16, 80, 160, 224, 272, 336, 368]

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to jump and will collide into tiles
	 * that are collidable.
	 *
	 * @param {Vector} dimensions The height and width of the player.
	 * @param {Vector} position The x and y coordinates of the player.
	 * @param {Vector} velocityLimit The maximum speed of the player.
	 * @param {Level} level The level that the player lives in.
	 */
	constructor(dimensions, position, velocityLimit, level) {
		super(dimensions, position, velocityLimit, level);


		this.gravityForce = new Vector(0, 1000);
		this.speedScalar = 5;
		this.frictionScalar = 0.9;
		this.hasGun = false
		this.hasSword = false
		this.jumpForce = new Vector(0, -350);
		this.totalHealth = Player.MAX_HEALTH;
		this.health = Player.MAX_HEALTH;
		this.sprites = Player.generateSprites(ImageName.CharacterIdle, Player.TOTAL_SPRITES_IDLE, Player.WIDTH, Player.HEIGHT)

		this.stateMachine = new StateMachine();
		this.stateMachine.add(PlayerStateName.Running, new PlayerRunningState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));
		this.stateMachine.add(PlayerStateName.Punching, new PlayerPunchingState(this));
		this.stateMachine.add(PlayerStateName.GunIdle, new PlayerGunIdleState(this));
		this.stateMachine.add(PlayerStateName.GunRunningAiming, new PlayerRunningGunState(this));
		this.stateMachine.add(PlayerStateName.Punching, new PlayerPunchingState(this));
		this.stateMachine.add(PlayerStateName.SwordIdle, new PlayerSwordIdleState(this));
		this.stateMachine.add(PlayerStateName.SwordRunning, new PlayerSwordRunningState(this));
		this.stateMachine.add(PlayerStateName.SwordSwinging, new PlayerSwordSwingingState(this));
		this.stateMachine.add(PlayerStateName.Hurt, new PlayerHurtState(this));
		this.stateMachine.add(PlayerStateName.Death, new PlayerDyingState(this));

		this.changeState(PlayerStateName.Falling);

		this.ammos = []
		this.timerTask
		this.idleDuration = 1
		this.delay = false
		this.score =0
		this.ammo = 0

	}




	/**
 * Loops through the character sprite sheet and
 * retrieves each sprite's location in the sheet.
 *
 * @returns The array of sprite objects.
 */
	static generateSprites(imageName, totalSprites, width = Player.WIDTH, height = Player.HEIGHT) {
		const sprites = [];

		for (let i = 1; i < totalSprites + 1; i++) {
			sprites.push(new Sprite(
				images.get(imageName),
				8 + (i - 1) * 48,
				8,
				width,
				height,
			));
		}

		return sprites;
	}

	static generateBigPunchSprites() {
		const sprites = [];

		let width = Player.WIDTH
		for (let i = 0; i < Player.BIG_PUNCH_SPRITES; i++) {

			if (i == 1 || i == 2) {
				width = Player.WIDTH * 2
			}
			else {
				width = Player.WIDTH
			}
			sprites.push(new Sprite(
				images.get(ImageName.BigPunch),
				Player.BIG_PUNCH_COORDINATES[i],
				16,
				width,
				Player.HEIGHT,
			));
		}

		return sprites
	}

	static generateDeathSprites()
	{
		const sprites = [];
		for (let i = 1; i <= Player.TOTAL_SPRITES_IDLE; i++) {


			sprites.push(new Sprite(
				images.get(ImageName.CharacterDeath),
				16+64*(i-1),
				16,
				Player.WIDTH+Player.WIDTH/2,
				Player.HEIGHT,
			));
		}
		return sprites
	}

	static generateSpritesSwordSwinging() {
		const sprites = [];

		for (let i = 1; i < 5; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.SwordSwinging),
				32 + (i - 1) * 96,
				8,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		for (let i = 5; i <= Player.SWORD_BIG_ATTACK; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.SwordSwinging),
				32 + (i - 1) * 96,
				8,
				Player.WIDTH * 2,
				Player.HEIGHT,
			));
		}

		return sprites;
	}


	moveLeft() {
		this.direction = Direction.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar * this.frictionScalar, -this.velocityLimit.x);
	}

	moveRight() {
		this.direction = Direction.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar * this.frictionScalar, this.velocityLimit.x);
	}

	stop() {
		if (Math.abs(this.velocity.x) > 0) {
			this.velocity.x *= this.frictionScalar;
		}

		if (Math.abs(this.velocity.x) < 0.1) {
			this.velocity.x = 0;
		}
	}

	shoot() {
		if(this.ammo<=0)
		{
		sounds.play(SoundName.EmptyGun)
			return
		}


sounds.play(SoundName.GunShot)
this.ammo--



		let ammo
		if (this.direction == 2) {
			ammo = new Ammo(
				new Vector(Ammo.WIDTH, Ammo.HEIGHT),
				new Vector(this.position.x - 25, this.position.y + 4),
				Direction.Left
			);
		}
		else {
			ammo = new Ammo(
				new Vector(Ammo.WIDTH, Ammo.HEIGHT),
				new Vector(this.position.x + 25, this.position.y + 4),
				Direction.Right
			);
		}


		this.ammos.push(ammo)
		this.level.objects.push(ammo)
	}

	cleanUpAmmos() {
		this.ammos = this.ammos.filter((ammo) => !ammo.cleanUp);
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the left edge of the map.
	 *   2. Overlapping with collidable tiles on the left.
	 *   3. Overlapping with collidable solid game objects on the left.
	 */
	checkLeftCollisions() {
		if (this.position.x < 0) {
			this.velocity.x = 0;
			this.position.x = 0;
		}
		else if (this.didCollideWithTiles([Direction.LeftBottom, Direction.LeftTop])) {
			const tileLeftTop = this.getTilesByDirection([Direction.LeftTop])[0];
			this.velocity.x = 0;

			if (tileLeftTop) {
				this.position.x = tileLeftTop.position.x * tileLeftTop.dimensions.x + tileLeftTop.dimensions.x - 1;
			}
		}
		else {
			const collisionObjects = this.checkObjectCollisions();

			if (collisionObjects.length > 0 && collisionObjects[0].getEntityCollisionDirection(this) === Direction.Right) {
				this.velocity.x = 0;
				this.position.x = collisionObjects[0].position.x + collisionObjects[0].dimensions.x - 1;
			}
		}
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the right edge of the map.
	 *   2. Overlapping with collidable tiles on the right.
	 *   3. Overlapping with collidable solid game objects on the right.
	 */
	checkRightCollisions() {
		if (this.position.x > this.level.tilemap.canvasDimensions.x - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = this.level.tilemap.canvasDimensions.x - this.dimensions.x;
		}
		else if (this.didCollideWithTiles([Direction.RightBottom, Direction.RightTop])) {
			const tileRightTop = this.getTilesByDirection([Direction.RightTop])[0];
			this.velocity.x = 0;

			if (tileRightTop) {
				this.position.x = tileRightTop.position.x * tileRightTop.dimensions.x - this.dimensions.x;
			}
		}
		else {
			const collisionObjects = this.checkObjectCollisions();

			if (collisionObjects.length > 0 && collisionObjects[0].getEntityCollisionDirection(this) === Direction.Left) {
				this.velocity.x = 0;
				this.position.x = collisionObjects[0].position.x - this.dimensions.x;
			}
		}
	}

	/**
	 * Check if we've collided with any entities and die if so.
	 *
	 * @param {Entity} entity
	 */
	onEntityCollision(entity) {

		if (!entity.isDead) {
			if (this.getCurrentState().name == PlayerStateName.SwordSwinging) {

				if (!this.delay) {
					entity.changeState(EntityStateName.Hurt,{damage:Player.SWORD_DAMAGE})
					this.delay = true
					this.startTimer()
				}
				return
			}
			else if(this.getCurrentState().name == PlayerStateName.Punching)
			{
				if (!this.delay) {
					entity.changeState(EntityStateName.Hurt,{damage:Player.PUNCH_DAMAGE})
					this.delay = true
					this.startTimer()
				}
				return
			}
			else if(this.getCurrentState().name == PlayerStateName.Hurt)
			{
				if (!this.delay) {
					this.delay = true
					this.startTimer()
				}
				return
			}



			if (!this.delay) {
				this.changeState(PlayerStateName.Hurt)
			}
		}

	}



	startTimer() {

		this.timerTask = timer.wait(this.idleDuration, () => {

			this.delay = false
		});
	}

	update(dt) {
		super.update(dt)

		if (!this.delay) {
			this.timerTask?.clear()
		}
	}

	/**
	 * Loops through all the entities in the current level and checks
	 * if the player collided with any of them. If so, run onCollision().
	 * If no onCollision() function was passed, use the one from this class.
	 *
	 * @param {function} onCollision What should happen when the collision occurs.
	 * @returns The collision objects returned by onCollision().
	 */
	checkEntityCollisions(onCollision = entity => this.onEntityCollision(entity)) {
		this.level.entities.forEach((entity) => {
			if (this === entity) {
				return;
			}

			if (entity.didCollideWithEntity(this)) {
				onCollision(entity);
			}
		});

		this.level.entities.forEach((entity) => {
			if (this === entity) {
				return;
			}
			this.level.objects.forEach((object) => {
				if (entity.didCollideWithEntity(object)) {
					object.onCollision(entity);
				}

			})

		});
	}



	/**
	 * Collects the object if the game object is solid or collidable.
	 * Fires onConsume() if the game object is consumable.
	 *
	 * @param {GameObject} object
	 * @returns All solid and collidable game objects that were collided with.
	 */
	onObjectCollision(object) {
		const collisionObjects = [];

		if (object.isSolid || object.isCollidable) {
			collisionObjects.push(object);
		}
		else if (object.isConsumable) {
			object.onConsume(this);
		}

		return collisionObjects;
	}

	/**
	 * Loops through all the game objects in the current level and checks
	 * if the player collided with any of them. If so, run onCollision().
	 * If no onCollision() function was passed, use the one from this class.
	 *
	 * @param {function} onCollision What should happen when the collision occurs.
	 * @returns The collision objects returned by onCollision().
	 */
	checkObjectCollisions(onCollision = object => this.onObjectCollision(object)) {
		let collisionObjects = [];

		this.level.objects.forEach((object) => {
			if (object.didCollideWithEntity(this)) {
				collisionObjects = onCollision(object);
			}
		});

		return collisionObjects;
	}
}
