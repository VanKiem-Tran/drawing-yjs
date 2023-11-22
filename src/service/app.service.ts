import { Subject } from 'rxjs';
import { PanelStoreAdapter, PanelService } from '../components/panel';
import { UserStoreAdapter, UserService } from '../components/user';
import { DrawingStoreAdapter, DrawingService } from '../components/drawing';
import { EventBus, CacheStoreSyncInterface, CommunicationService, CacheStoreSync, PersistentStore } from '.';

export enum AppEventType {
	PANEL_START = 'panel_start',
	PANEL_END = 'panel_end',
}

export interface AppStateEvent {
	type: AppEventType;
	value: any;
}

function createEvent(type: AppEventType, value: any): AppStateEvent {
	return { type, value };
}

export class AppService {
	panelEntered = false;
	drillholeID: string;
	subject: Subject<AppStateEvent> = new Subject();

	cacheStore: CacheStoreSyncInterface;
	commService: CommunicationService;
	eventBus: EventBus;

	// Adapters
	drawingStoreAdapter: DrawingStoreAdapter;
	PanelStoreAdapter: PanelStoreAdapter;
	userStoreAdapter: UserStoreAdapter;

	// services
	drawingService: DrawingService;
	PanelService: PanelService;
	userService: UserService;

	startPanel() {
		if (this.PanelService.isPanelRunning()) return;

		this.PanelService.setupPanel({});
		this.PanelService.startPanel();
	}
	enterPanel(drillholeID = ''): void {
		this.drillholeID = drillholeID;

		// THE Big Setup
		this.eventBus = new EventBus();
		this.cacheStore = new CacheStoreSync();

		// Instance of the Adapers
		this.PanelStoreAdapter = new PanelStoreAdapter(this.cacheStore);
		this.userStoreAdapter = new UserStoreAdapter(this.cacheStore);
		this.drawingStoreAdapter = new DrawingStoreAdapter(this.cacheStore);

		//
		this.PanelService = new PanelService(this.PanelStoreAdapter);
		this.userService = new UserService(this.userStoreAdapter);
		this.drawingService = new DrawingService(this.drawingStoreAdapter);

		// User Init
		this.userService.create(PersistentStore.localName);

		// setup to Communication Service to connect to others
		this.commService = new CommunicationService(
			this.cacheStore,
			this.eventBus,
			this.drillholeID
		);

		// setup listener to the different services
		this.eventBus.addService(this.PanelService);
		this.eventBus.addService(this.userService);
		this.eventBus.addService(this.drawingService);

		this.panelEntered = true;
		this.subject.next(createEvent(AppEventType.PANEL_START, drillholeID));
	}
}
