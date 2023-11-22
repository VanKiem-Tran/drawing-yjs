import { PlayerModel, PlayerProps } from './user.model';

export interface PlayerStorePort {
	/**
	 * Function adds a local player!
	 * @param player the local player
	 */
	add(player: PlayerModel): PlayerModel;
	/**
	 * 
	 * @param props Props
	 */
	updateProp(props: PlayerProps);
	onUpdate(handler: (player: Map<string, PlayerModel>) => void);
}
