import TileType from "../enums/TileType.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import Graphic from "../../lib/Graphic.js";
import Tile from "../objects/Tile.js";
import Tilemap from "../objects/Tilemap.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Level from "../objects/Level.js";
import WoodCutter from "../entities/WoodCutter.js";
import Vector from "../../lib/Vector.js";
import Decoration from "../objects/Decoration.js";
import Chest from "../objects/Chest.js";
import Player from "../entities/Player.js";
import GraveRobber from "../entities/GraveRobber.js";

export default class LevelMaker {
	static TILE_SET_WIDTH = 5;
	static TILE_SET_HEIGHT = 4;
	static TILE_SETS_WIDTH = 6;
	static TILE_SETS_HEIGHT = 10;
	static TOPPER_SETS_WIDTH = 6;
	static TOPPER_SETS_HEIGHT = 18;
	static DEFAULT_LEVEL_WIDTH = 45;
	static DEFAULT_LEVEL_HEIGHT = 18;


	static GROUND_HEIGHT = LevelMaker.DEFAULT_LEVEL_HEIGHT - 4;
	static PILLAR_CHANCE = 0.2;
	static MAX_PILLAR_HEIGHT = LevelMaker.GROUND_HEIGHT - 6;


	static MIN_CHASM_WIDTH = 2;
	static MAX_CHASM_WIDTH = 5;

	static CHEST_CHANCE = 0.03;
	static CHEST_HEIGHT = 4;
	static Decoration_CHANCE = 0.05;
	static Decoration_HEIGHT = 3;

	static WoodCutter_CHANCE = 0.1;

	static generateLevel(width = LevelMaker.DEFAULT_LEVEL_WIDTH, height = LevelMaker.DEFAULT_LEVEL_HEIGHT) {
		const tiles = new Array();
		const entities = [];
		const objects = [];
		const tileSet = 0
		const topperSet = 1

		LevelMaker.initializeTilemap(tiles, height);

		for (let x = 0; x < width; x++) {
			LevelMaker.generateEmptySpace(tiles, x, tileSet, topperSet);

			LevelMaker.generateColumn(tiles, x, height, tileSet, topperSet, objects);

		}

		const tileSets = LevelMaker.generateSprites(
			images.get(ImageName.Map),
			LevelMaker.TILE_SETS_WIDTH,
			LevelMaker.TILE_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT,
		);
		const topperSets = LevelMaker.generateSprites(
			images.get(ImageName.Toppers),
			LevelMaker.TOPPER_SETS_WIDTH,
			LevelMaker.TOPPER_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT,
		);
		const tilemap = new Tilemap(
			width,
			height,
			tiles,
			tileSets,
			topperSets,
		);

		return new Level(tilemap, entities, objects);
	}

	/**
	 * Initialize the tiles array with empty arrays.
	 *
	 * @param {array} tiles
	 * @param {number} height
	 */
	static initializeTilemap(tiles, height) {
		for (let i = 0; i < height; i++) {
			tiles.push([]);
		}
	}

	/**
	 * Loops from the top of the map until the ground starts
	 * and fill those spaces with empty tiles.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateEmptySpace(tiles, x, tileSet, topperSet) {
		for (let y = 0; y < LevelMaker.GROUND_HEIGHT; y++) {
			tiles[y].push(new Tile(x, y, TileType.Empty, false, tileSet, topperSet));
		}
	}



	/**
	 * Generates the ground that the player can walk on.
	 * Will randomly decide to generate a pillar which is simply
	 * just ground tiles higher than the base ground height.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} height
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateColumn(tiles, x, height, tileSet, topperSet, objects) {

		let columnStart = 14
		LevelMaker.generateChest(objects, x, columnStart - LevelMaker.CHEST_HEIGHT + 3);
		LevelMaker.generateDecoration(objects, x, columnStart - LevelMaker.Decoration_HEIGHT);




		if (x >= 6 && x <= 9) {
			columnStart = 0
		}


		if (x >= 18 && x <= 21) {
			columnStart = 0
		}

		if (x >= 29 && x < 32) {
			columnStart = 0
		}


		for (let y = columnStart; y < height; y++) {



			if ((y > 3 && y < 8) && x == 1) {
				tiles[y][x] = new Tile(x, y, TileType.Empty, y === columnStart, tileSet, topperSet);
			}
			else if ((y != 10 && y < 14) && (x >= 6 && x <= 9)) {
				tiles[y][x] = new Tile(x, y, TileType.Empty, y === columnStart, tileSet, topperSet);
			}
			else if ((y > 10 && y < 14) && (x >= 18 && x <= 21)) {
				tiles[y][x] = new Tile(x, y, TileType.Empty, y === columnStart, tileSet, topperSet);
			}
			else if ((y != 10 && y < 14) && (x >= 29 && x <= 32)) {
				tiles[y][x] = new Tile(x, y, TileType.Empty, y === columnStart, tileSet, topperSet);
			}
			else
				tiles[y][x] = new Tile(x, y, TileType.Ground, y === columnStart, tileSet, topperSet);
		}
	}



	static generateChest(objects, x, y) {
		if (didSucceedChance(LevelMaker.CHEST_CHANCE)) {
			objects.push(new Chest(
				new Vector(Chest.WIDTH, Chest.HEIGHT),
				new Vector(x * Tile.SIZE, y * Tile.SIZE),
			));
		}
	}

	static generateDecoration(objects, x, y) {
		if (didSucceedChance(LevelMaker.Decoration_CHANCE)) {
			objects.push(new Decoration(
				new Vector(Decoration.WIDTH, Decoration.HEIGHT),
				new Vector(x * Tile.SIZE, y * Tile.SIZE),
			));
		}
	}

	/**
	 * Spawns enemies randomly throughout the level.
	 *
	 * @param {Level} level
	 * @param {Player} player
	 */
	static generateEnemies(level, player, chance) {
		for (let x = 0; x < level.tilemap.tileDimensions.x - 1; x++) {
			for (let y = 0; y < level.tilemap.tileDimensions.y - 1; y++) {
				// Only spawn WoodCutters on ground tiles.
				if (level.tilemap.tiles[y][x].id === TileType.Ground) {


					if (y == 0) {
						return
					}

					if (didSucceedChance(chance)) {


						const woodCutter = new WoodCutter(
							new Vector(WoodCutter.WIDTH, WoodCutter.HEIGHT),
							new Vector(x * Tile.SIZE, ((y - 1) * Tile.SIZE)),
							new Vector(WoodCutter.VELOCITY_LIMIT, WoodCutter.VELOCITY_LIMIT),
							level,
							player,
						);


						const graveRobber = new GraveRobber(
							new Vector(GraveRobber.WIDTH, GraveRobber.HEIGHT),
							new Vector(x * Tile.SIZE, ((y - 1) * Tile.SIZE)),
							new Vector(GraveRobber.VELOCITY_LIMIT, GraveRobber.VELOCITY_LIMIT),
							level,
							player,
						);


						if (Math.random() > 0.5) {
							level.addEntity(graveRobber)
						}
						else {
							level.addEntity(woodCutter);
						}


					}

					// Only spawn enemies on the top ground tile of any given column.
					break;
				}
			}
		}
	}

	/**
	 * Generates a 2D array populated with Sprite objects.
	 *
	 * @param {Graphic} spriteSheet
	 * @param {number} setsX
	 * @param {number} setsY
	 * @param {number} sizeX
	 * @param {number} sizeY
	 * @returns A 2D array of sprite objects.
	 */
	static generateSprites(spriteSheet, setsX, setsY, sizeX, sizeY) {
		const tileSets = new Array();
		let counter = -1;

		// for each tile set on the X and Y
		for (let tileSetY = 0; tileSetY < setsY; tileSetY++) {
			for (let tileSetX = 0; tileSetX < setsX; tileSetX++) {
				tileSets.push([]);
				counter++;


				for (let y = sizeY * tileSetY; y < sizeY * tileSetY + sizeY; y++) {
					for (let x = sizeX * tileSetX; x < sizeX * tileSetX + sizeX; x++) {
						tileSets[counter].push(new Sprite(
							spriteSheet,
							x * Tile.SIZE,
							y * Tile.SIZE,
							Tile.SIZE,
							Tile.SIZE,
						));
					}
				}
			}
		}

		return tileSets;
	}
}
