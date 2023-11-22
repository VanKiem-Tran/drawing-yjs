import { Subject } from 'rxjs';
import { PanelStorePort } from './panel_store.port';
import { PanelModelProp, PanelEvents, PanelStates, PanelModel, PanelModelKeys } from './panel.model';

import { ServiceInterface } from '../base/service.interface';
import { hashString } from '../../util';
import { PersistentStore } from '../../service';

/**
 * Events 
 */
interface PanelEvent {
	type: PanelEvents;
	value?: any;
}

/**
 * Utility function to create PanelService Events
 * faster then using class. Use this, until, a class is needed
 * meanwhile plain objects are fine
 * 
 * @param type : PanelEvents
 * @param value : any
 */
const createEvent = (type: PanelEvents, value?: any): PanelEvent => {
	return {
		type,
		value
	} as PanelEvent;
};

export class PanelService implements ServiceInterface<PanelEvent> {
	private _timer: NodeJS.Timeout;
	private _adapter: PanelStorePort;
	private _subject = new Subject<PanelEvent>();

	get subject(): Subject<PanelEvent> {
		console.log('someone is using the subject');
		return this._subject;
	}

	constructor(adapter: PanelStorePort) {
		this._adapter = adapter;

		this._adapter.onUpdate((prop: PanelModelProp) => {
			Object.entries(prop).forEach(([ key, value ]) => {
				this._handlePanelStateChanged(key as PanelModelKeys, value);
			});
		});
	}

	dispose() {
		console.log('PanelService dispose');
		clearInterval(this._timer);
		this._subject.complete();
	}

	// sorted after probability of occurring
	private _handlePanelStateChanged(key: PanelModelKeys, value: any): void {
		if (this._subject.observers.length === 0) return;

		this._subject.next(createEvent(PanelEvents.PANEL_STARTED));
	}

	setupPanel(props: PanelModelProp): void {
		console.log('Setup panel');
		const prop = {
			codeWordHash: (props.codeWordHash && hashString(props.codeWordHash)) || hashString('test'),
			currentMasterID: props.currentMasterID || PersistentStore.id,
			state: props.state || PanelStates.WAITING,
		} as PanelModel;

		clearInterval(this._timer);
		this._adapter.updateProp(prop);
	}

	startPanel(): void {
		const state = this._adapter.get('state');

		if (state === PanelStates.STARTED || state === PanelStates.CHOOSING_WORD) return;

		console.log('START PANEL');
		this._adapter.updateProp({
			state: PanelStates.STARTED
		});
	}

	get panelState(): PanelStates {
		return this._adapter.get('state') as PanelStates;
	}

	isPanelRunning(): boolean {
		const state = this.panelState;
		return state === PanelStates.CHOOSING_WORD || state === PanelStates.STARTED;
	}
}
