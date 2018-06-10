import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { FinderTreeNode } from '../models/finder-tree-node';
import { PanelEvent } from '../models/panel-event';

@Component({
	selector: 'czeckd-finder-tree-panel',
	templateUrl: './finder-tree-panel.component.html',
	styleUrls: ['./finder-tree-panel.component.scss']
})
export class FinderTreePanelComponent {
	@Input() list: Array<FinderTreeNode>;
	@Input() id = -1;
	@Input() display = true;

	@Output() openChildren = new EventEmitter<PanelEvent>();
	@Output() closeChildren = new EventEmitter<PanelEvent>();

	constructor() { }

	openNode(node: FinderTreeNode) {
		if (node.open) {
			node.open = false;
			this.closeChildren.emit(new PanelEvent(node, this.id));
		} else {
			if (node.parent) {
				node.parent.children.map( (n: FinderTreeNode) => n.open = false);
			}
			node.open = true;
			this.openChildren.emit(new PanelEvent(node, this.id));
		}
	}

}
