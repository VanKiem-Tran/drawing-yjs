/**
 * The PanelModelProp allows to just use one 
 * of the props, 
 */
export interface PanelModelProp {
	currentMasterID?: number;
	codeWordHash?: string;
	state?: PanelStates;
}

/**
 * The PanelModel needs all of the props!
 */
export interface PanelModel extends PanelModelProp {
	currentMasterID: number;
	codeWordHash: string;
	state: PanelStates;
}

export type PanelModelKeys = keyof PanelModel;

export enum PanelStates {
	WAITING = 'WAITING',
	CHOOSING_WORD = 'CHOOSE_WORD',
	STARTED = 'STARTED',
	STOPPED = 'STOPPED'
}

export enum PanelEvents {
	PANEL_STARTED = 'PANEL_STARTED',
}

export const PANEL_STORE_NAME = 'panel';
