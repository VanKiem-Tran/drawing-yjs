import { UserModel, UserProps } from './user.model';

export interface UserStorePort {
	/**
	 * Function adds a local user!
	 * @param user the local user
	 */
	add(user: UserModel): UserModel;
	/**
	 * 
	 * @param props Props
	 */
	updateProp(props: UserProps);
	onUpdate(handler: (user: Map<string, UserModel>) => void);
}
