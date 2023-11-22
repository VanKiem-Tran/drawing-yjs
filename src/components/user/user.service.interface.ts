import { User } from './user.model';
import { ServiceInterface } from '../base/service.interface';

export interface UserServiceInterface extends ServiceInterface<User[]> {
	users: User[];
	create(name: string): void;
	addPoints(points: number): void;
	updateName(name: string): void;
	isLocalUser(id: number): boolean;
}
