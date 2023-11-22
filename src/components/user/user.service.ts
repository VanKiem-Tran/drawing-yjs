import { UserStorePort } from './user.store.port';
import { UserModel, User } from './user.model';
import { Subject } from 'rxjs';
import { UserServiceInterface } from './user.service.interface';

/**
 * This User Service operates only the local User, hence, no Id is needed
 */
export class UserService implements UserServiceInterface {
	private _map = new Map<string, UserModel>();
	private _adapter: UserStorePort;
	private _localUser: UserModel;
	private _subject = new Subject<User[]>();
	private _heartBeat;

	get subject(): Subject<User[]> {
		return this._subject;
	}

	get users(): User[] {
		const users: User[] = [];

		for (const p of Array.from(this._map.values())) {
			users.push(new User(p));
		}
		return users;
	}

	isLocalUser(id: number): boolean {
		return id === this._localUser.id;
	}

	constructor(adapter: UserStorePort) {
		this._adapter = adapter;

		this._adapter.onUpdate((users) => {
			this._map = users;
			this._subject.next(this.users);
		});
	}

	dispose(): void {
		clearInterval(this._heartBeat);
	}

	create(name: string): void {
		// should only be called once
		if (this._localUser) return;

		this._localUser = this._adapter.add({
			lastOnline: Date.now(),
			name: name,
			points: 0,
			id: 0
		});

		clearInterval(this._heartBeat);
		// setup a keep alive interval to
		this._heartBeat = setInterval(() => {
			this._adapter.updateProp({
				lastOnline: Date.now()
			});
		}, 1000);
	}

	updateName(name: string): void {
		this._adapter.updateProp({ name });
	}

	addPoints(points: number): void {
		this._adapter.updateProp({
			points: this._localUser.points + points
		});
	}
}
