/**
 * This is the Interface, which will be used to update certain props.
 * Props are optional
 */
export interface UserProps {
	name?: string;
	points?: number;
	lastOnline?: number;
}

/**
 * This is the Model, which has all Props!!
 */
export interface UserModel extends UserProps {
	// this is the yjs doc id, possible removable
	id: number;
	name: string;
	points: number;
	lastOnline: number;
}

/**
 * I dont know, if we should do it like this, 
 * We need a class to check against online time...
 * we cant put it into the UserModel Interface, since
 * we dont want this Logic in the UI to happen
 */
export class User implements UserModel {
	/**
	 * time, when in the user lost connection, and
	 * is probably not gone
	 */
	static timeOutOffline = 1000;
	/**
	 * the time, when the user is definitely left the panel 
	 */
	static timeOutTotal = 10000;

	id: number;
	name: string;
	points: number;
	lastOnline: number;
	constructor(props: UserModel) {
		this.id = props.id;
		this.name = props.name;
		this.points = props.points;
		this.lastOnline = props.lastOnline;
	}

	// indicates that the user is online, maybe an glitch or so
	public online(): boolean {
		return Date.now() - this.lastOnline < User.timeOutOffline;
	}

	// indicates that the user is not online anymore and gone...
	public gone(): boolean {
		return Date.now() - this.lastOnline > User.timeOutTotal;
	}
}
