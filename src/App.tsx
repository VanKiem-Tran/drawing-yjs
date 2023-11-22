import React, { useState, useEffect, useContext } from 'react';
import { LandingScene, PanelScene } from './scenes';
import './App.css';
import { AppService, AppEventType } from './service';

type AppProps = {
	service: AppService;
};

const service = new AppService();

export const AppContext = React.createContext<AppProps>({
	service
});

const AppWrapper: React.FC = () => {
	return (
		<AppContext.Provider value={{ service }}>
			<App />;
		</AppContext.Provider>
	);
};

enum AppStates {
	PANEL,
	MENU
}

const App: React.FC = () => {
	const { service } = useContext(AppContext);;
	const [ appState, setAppState ] = useState<AppStates>(AppStates.MENU);

	useEffect(
		() => {
			service.subject.subscribe((event) => {
				if (event.type === AppEventType.PANEL_START) {
					// set URL
					const url = window.location.origin + '/' + event.value;
					window.history.replaceState('', 'Room', url);
					setAppState(AppStates.PANEL);
				} else {
					window.history.replaceState('', 'Room', '');
					setAppState(AppStates.MENU);
				}
			});
		},
		[ service ]
	);

	return (
		<div className="App">
			{appState === AppStates.MENU && <LandingScene key="landing-scene" />}
			{appState === AppStates.PANEL && <PanelScene key="panel-scene" />}
		</div>
	);
};

export default AppWrapper;
