/**
 * The GameModelProp allows to just use one 
 * of the props, 
 */
export interface GameModelProp {
	currentMasterID?: number;
	codeWordHash?: string;
	round?: number;
	roundsPerGame?: number;
	state?: GameStates;
	timePerRound?: number;
	time?: number;
}

/**
 * The GameModel needs all of the props!
 */
export interface GameModel extends GameModelProp {
	currentMasterID: number;
	codeWordHash: string;
	round: number;
	roundsPerGame: number;
	state: GameStates;
	timePerRound: number;
	time: number;
}

export type GameModelKeys = keyof GameModel;

/**
 * The States the Game can be
 */
export enum GameStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

/**
 * Game Events
 */
export enum GameEvents {
	GAME_STARTED = 'GAME_STARTED',
}

export const GAME_STORE_NAME = 'game';
