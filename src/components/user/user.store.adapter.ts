import { Map as YMap } from 'yjs';
import { UserStorePort } from './user.store.port';
import { UserModel, UserProps } from './user.model';
import { CacheStoreSyncInterface, PersistentStore } from '../../service';


export class UserStoreAdapter implements UserStorePort {
	private _store = new YMap<YMap<UserModel>>();
	private _transact;

	constructor(store: CacheStoreSyncInterface) {
		this._store = store.yDoc.getMap('user');

		this._transact = store.transact;
		this._store.observe(this._observer);
		this._store.observeDeep(this._onUserUpdate);
	}

	/**
	 * This observer gets notified, when the store changes
	 * either, user gets added, updated, or removed
	 * on the key -value level, not the actual user props
	 */
	_observer = (event, tran) => {
		// or should just get that key
		for (const [key, changeAction] of event.changes.keys) {
			const map = this._store.get(key);
			console.log(key, changeAction.action, map);
		}
	};

	dispose(): void {
		this._store.unobserveDeep(this._onUserUpdate);
		this._store.unobserve(this._observer);
	}

	/**
     * Override this function
     */
	private _updateLister = (p: Map<string, UserModel>): void => {
		throw Error('Nobody is Listen to me!');
	};

	// converts form yjs-map to normal map
	private _onUserUpdate = (): void => {
		const users = new Map<string, UserModel>();

		this._store.forEach((user, key) => {
			users.set(key, user.toJSON() as UserModel);
		});

		this._updateLister(users);
	};

	/**
     *  Function operates only on local user!
     */
	add(user: UserModel): UserModel {
		const p = new YMap<UserModel>();

		user.id = PersistentStore.id;

		// update in a batch
		this._transact(() => {
			const obj = Object.entries(user);
			obj.forEach(([key, value]) => p.set(key, value));
		});

		this._store.set(PersistentStore.id.toString(), p);
		return user;
	}

	/**
     * Function operates only on local user!
     */
	updateProp(props: UserProps): void {
		const p = this._store.get(PersistentStore.id.toString());

		if (p) {
			// update in a batch
			this._transact(() => {
				const obj = Object.entries(props);

				obj.forEach(([key, value]) => {
					p.set(key, value);
				});
			});
		}
	}

	onUpdate(handler: (users: Map<string, UserModel>) => void): void {
		this._updateLister = handler;
	}
}
