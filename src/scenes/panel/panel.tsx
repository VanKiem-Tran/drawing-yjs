import React, { useContext } from 'react';
import { DrawingArea } from '../../ui-components';
import { AppContext } from '../../App';

export const Panel = (props) => {
	const { service: { drawingService } } = useContext(AppContext);
  console.log(drawingService);
	return (
		<div>
			<div className="App-Drawing">
				<DrawingArea service={drawingService} width={1000} height={500} />
			</div>
		</div>
	);
};
