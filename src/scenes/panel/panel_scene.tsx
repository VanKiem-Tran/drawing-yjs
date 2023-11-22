import React, { useContext, useEffect, useState } from 'react';
import { Panel } from './panel';
import { AppContext } from '../../App';
import { PanelEvents } from '../../components/panel';

enum PanelState {
	WAITING_ROOM,
	PLAY,
	LOADING
}

export const PanelScene: React.FC = () => {
	const { service } = useContext(AppContext);
	const startPanel = (): void => service.startPanel();
	const [panelState, setState] = useState<PanelState>(PanelState.WAITING_ROOM);

	useEffect(() => {
		const sub = service.PanelService.subject.subscribe((event) => {
			switch (event.type) {
				case PanelEvents.PANEL_STARTED:
					setState(PanelState.PLAY);
					break;
			}
		});

		startPanel();

		return (): void => {
			sub.unsubscribe();
		};
	}, [service.PanelService]);

	// If Panel, it means, connection to peers are established
	return (
		<React.Fragment>
			<div style={{ marginTop: '10px', width: '100%', height: '50px' }} />
			{panelState === PanelState.LOADING && <Loading />}
			{panelState === PanelState.PLAY && <Panel />}
		</React.Fragment>
	);
};

const Loading = () => <div>Please Wait, its loading</div>;
