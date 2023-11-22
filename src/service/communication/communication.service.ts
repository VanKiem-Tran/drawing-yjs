import Chance from 'chance';
import { WebrtcProvider } from './y-plugings/y-webrtc';
import { EventBusInterface } from '../event.bus';
import { PersistentStore, CacheStoreSyncInterface } from '../store';

export class CommunicationService {
	private _provider;
	drillholeID: string;

	constructor(store: CacheStoreSyncInterface, eventBus: EventBusInterface, roomName = '') {
		const peerID = PersistentStore.id;
		// create random room name based on the peerID as seed.
		this.drillholeID = roomName === '' ? Chance(peerID).string({ length: 20, alpha: true, numeric: true }) : roomName;

		this.drillholeID = this.drillholeID.toLowerCase();

		const room = 'sketchguessr-' + this.drillholeID;

		this._provider = new WebrtcProvider(room, store.yDoc);

		this._provider.on('synced', (synced) => {
			console.error('synced!', synced);
			eventBus.onSync(synced);
		});

		this._provider.on('peers', (peers) => {
			console.log(peers);
			peers.added.forEach((peerID) => eventBus.onPlayerConnection(peerID, true));
			peers.removed.forEach((peerID) => eventBus.onPlayerConnection(peerID, false));
		});

		// Clean up Provider
		window.onbeforeunload = (event) => this.dispose(event);
	}

	// cleanup
	async dispose(event?) {
		console.log('Communication service dispose');
		await this._provider.destroy();

		const ev = event || window.event;
		ev.preventDefault = true;
		ev.cancelBubble = true;
		ev.returnValue = '';
		ev.message = '';
	}
}
