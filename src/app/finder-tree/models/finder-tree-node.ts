import { isEmpty } from 'lodash';

export class FinderTreeNode {
    name: string;
	children: Array<FinderTreeNode>;
	open: boolean;

    constructor(name: string = '', children: Array<FinderTreeNode> = new Array<FinderTreeNode>() ) {
        this.name = name;
        this.children = children;
		this.open = false;
	}

    isLeaf(): boolean {
        return this.children.length === 0;
    }
}
