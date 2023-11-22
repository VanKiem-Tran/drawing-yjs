import { PanelModelProp, PanelModel } from './panel.model';

export interface PanelStorePort {
	updateProp(props: PanelModelProp): void;
	onUpdate: (f: (prop: PanelModelProp) => void) => void;
	dispose();
	get<K extends keyof PanelModel>(key: K): PanelModel[K] | undefined;
	set<K extends keyof PanelModel>(key: K, value: PanelModel[K]): void;
}
