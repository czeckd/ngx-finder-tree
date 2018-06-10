import { FinderTreeNode } from './finder-tree-node';

export class PanelEvent {
	constructor(public node: FinderTreeNode, public id: number) {}
}
