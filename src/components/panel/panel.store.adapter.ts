/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Map as YMap } from 'yjs';
import { PanelStorePort } from './panel_store.port';
import { CacheStoreSyncInterface } from '../../service';
import { PANEL_STORE_NAME, PanelModelProp, PanelModel, PanelModelKeys } from './panel.model';



export class PanelStoreAdapter implements PanelStorePort {
	private _store = new YMap<PanelModel>();
	private _transact;

	constructor(store: CacheStoreSyncInterface) {
		this._store = store.yDoc.getMap(PANEL_STORE_NAME);
		this._transact = store.transact;
		this._store.observe(this._observer);
	}

	/**
	 * This observer gets notified, when the store changes
	 * either, player gets added, updated, or removed
	 * on the key -value level, not the actual player props
	 */
	_observer = (event, tran): void => {
		// console.log(tran);
		// or should just get that key
		for (const [key] of event.changes.keys) {
			const value = this._store.get(key);
			// console.log(key, changeAction.action, value);
			this._updateListener({ [key]: value });
		}
	};

	dispose(): void {
		this._store.unobserve(this._observer);
	}

	updateProp(props: Partial<PanelModelProp>): void {
		this._transact(() => {
			const obj = Object.entries(props);
			// @ts-ignore
			obj.forEach(([key, value]) => this._store.set(key, value));
		});
	}

	get<K extends PanelModelKeys>(key: K): PanelModel[K] | undefined {
		return this._store.get(key) as PanelModel[K] | undefined;
	}

	set<K extends PanelModelKeys>(key: K, value: PanelModel[K]): void {
		// @ts-ignore need to ignore, since the jsdoc annotation is not
		// right within the yjs library
		this._store.set(key, value);
	}

	/**
     * Override this function
     */
	private _updateListener = (prop: Partial<PanelModelProp>): void => {
		throw Error('Hey, nobody is listening to me!');
	};

	/**
	 * Use this to override the _updateListener function
	 * @param f Function callback 
	 */
	onUpdate(f: (prop: PanelModelProp) => void): void {
		this._updateListener = f;
	}
}
