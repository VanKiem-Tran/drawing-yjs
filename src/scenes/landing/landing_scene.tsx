import React, { useContext } from 'react';
import { Input } from '../../ui-components/common/input';
import './landing.css';
import { AppContext } from '../../App';

export const LandingScene: React.FC = () => {
	const { service } = useContext(AppContext);
	const viewPanel = (drillholeID: string): void => service.enterPanel(drillholeID);

	return (
		<div className="landing-page">
			<div>
				<Input
					onSubmit={viewPanel}
					options={{
						buttonLabel: 'View',
						label: 'Drillhole ID',
            placeholder: 'Please enter the drillhole ID?'
					}}
				/>
			</div>
		</div>
	);
};
