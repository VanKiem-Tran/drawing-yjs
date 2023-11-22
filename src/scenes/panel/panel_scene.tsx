import React, { useContext, useEffect, useState } from 'react';
import { Game } from './panel';
import { AppContext } from '../../App';
import { GameEvents } from '../../components/panel';

enum GameState {
	WAITING_ROOM,
	PLAY,
	LOADING
}

export const GameScene: React.FC = () => {
	const { service } = useContext(AppContext);
	const startGame = (): void => service.startGame();
	const [ gameState, setState ] = useState<GameState>(GameState.WAITING_ROOM);

	useEffect(
		() => {
			const sub = service.gameService.subject.subscribe((event) => {
				switch (event.type) {
					case GameEvents.GAME_STARTED:
						setState(GameState.PLAY);
						break;
				}
			});

      startGame();

			return (): void => {
				sub.unsubscribe();
			};
		},
		[ service.gameService ]
	);

	// If Game, it means, connection to peers are established
	return (
		<React.Fragment>
      <div style={{ marginTop: '10px', width: '100%', height: '50px' }} />
			{gameState === GameState.LOADING && <Loading />}
			{gameState === GameState.PLAY && <Game />}
		</React.Fragment>
	);
};

const Loading = () => <div>Please Wait, its loading</div>;
