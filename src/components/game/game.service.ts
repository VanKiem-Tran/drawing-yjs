import { Subject } from 'rxjs';
import { GameStorePort } from './game_store.port';
import { GameModelProp, GameEvents, GameStates, GameModel, GameModelKeys } from './game.model';

import { ServiceInterface } from '../base/service.interface';
import { hashString } from '../../util';
import { PersistentStore } from '../../service';

/**
 * Events 
 */
interface GameEvent {
	type: GameEvents;
	value?: any;
}

/**
 * Utility function to create GameService Events
 * faster then using class. Use this, until, a class is needed
 * meanwhile plain objects are fine
 * 
 * @param type : GameEvents
 * @param value : any
 */
const createEvent = (type: GameEvents, value?: any): GameEvent => {
	return {
		type,
		value
	} as GameEvent;
};

export class GameService implements ServiceInterface<GameEvent> {
	private _timer: NodeJS.Timeout;
	private _adapter: GameStorePort;
	private _subject = new Subject<GameEvent>();

	get subject(): Subject<GameEvent> {
		console.log('someone is using the subject');
		return this._subject;
	}

	constructor(adapter: GameStorePort) {
		this._adapter = adapter;

		this._adapter.onUpdate((prop: GameModelProp) => {
			Object.entries(prop).forEach(([ key, value ]) => {
				this._handleGameStateChanged(key as GameModelKeys, value);
			});
		});
	}

	dispose() {
		console.log('GameService dispose');
		clearInterval(this._timer);
		this._subject.complete();
	}

	// sorted after probability of occurring
	private _handleGameStateChanged(key: GameModelKeys, value: any): void {
		if (this._subject.observers.length === 0) return;

		this._subject.next(createEvent(GameEvents.GAME_STARTED));
	}

	setupGame(props: GameModelProp): void {
		console.log('Setup Game');
		const prop = {
			codeWordHash: (props.codeWordHash && hashString(props.codeWordHash)) || hashString('test'),
			round: props.round || 1,
			roundsPerGame: props.roundsPerGame || 3,
			currentMasterID: props.currentMasterID || PersistentStore.id,
			state: props.state || GameStates.WAITING,
			time: props.time || 60,
			timePerRound: props.timePerRound || 60
		} as GameModel;

		clearInterval(this._timer);
		this._adapter.updateProp(prop);
	}

	startGame(): void {
		const state = this._adapter.get('state');

		if (state === GameStates.STARTED || state === GameStates.CHOOSING_WORD) return;

		console.log('START GAME');
		this._adapter.updateProp({
			state: GameStates.STARTED
		});
	}

	get gameState(): GameStates {
		return this._adapter.get('state') as GameStates;
	}

	isGameRunning(): boolean {
		const state = this.gameState;
		return state === GameStates.CHOOSING_WORD || state === GameStates.STARTED;
	}
}
