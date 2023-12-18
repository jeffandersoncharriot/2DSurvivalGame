import Vector from "../../lib/Vector.js";
import Entity from "../entities/Entity.js";
import Direction from "../enums/Direction.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { sounds, stateMachine, timer } from "../globals.js";
import Ammo from "./Ammo.js";
import Background from "./Background.js";

export default class Level {
	constructor(tilemap, entities = [], objects = []) {
		this.tilemap = tilemap;
		this.entities = entities;
		this.objects = objects;
		this.background = new Background(this.tilemap.canvasDimensions);

	}




	update(dt) {

		this.goVictoryState()

		this.cleanUpEntitiesAndObjects();

		timer.update(dt);

		this.tilemap.update(dt);
		this.background.update();

		this.objects.forEach((object) => {
			object.update(dt);
		});

		this.entities.forEach((entity) => {
			entity.update(dt);
		});
	}

	goVictoryState() {
	
	
		if (this.entities.length == 1) {

			stateMachine.change(GameStateName.Victory, {
				level: this,
				levelNum: this.entities[0].levelNum,
				player:this.entities[0]
			})

			sounds.play(SoundName.Victory)

		}
	}

	render() {
		this.background.render();
		this.tilemap.render();

		this.objects.forEach((object) => {
			object.render();
		});

		this.entities.forEach((entity) => {
			entity.render();
		});
	}

	cleanUpEntitiesAndObjects() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
		this.objects = this.objects.filter((object) => !object.cleanUp);
	}

	/**
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
	}

	addCamera(camera) {
		this.background.addCamera(camera);
	}
}
