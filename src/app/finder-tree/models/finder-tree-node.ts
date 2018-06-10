import { isEmpty } from 'lodash';

import { FinderTreePanelComponent } from '../finder-tree-panel/finder-tree-panel.component';
import { TreeNode } from './tree-node';

export class FinderTreeNode extends TreeNode {
	parent: FinderTreeNode;
	children: Array<FinderTreeNode>;
	open: boolean;

	constructor(values: Object = {}) {
		super();
		this.open = false;

		if (!isEmpty(values)) {
			// Do not just do: Object.assign(this, values);
			this.name = values['name'];
			this.children = values['children'].map(x => {
				const node = new FinderTreeNode(x);
				node.parent = this;
				return node;
			});
		} else {
			this.name = '';
			this.children = new Array<FinderTreeNode>();
		}
	}
}
