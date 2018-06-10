// http://www.btechsmartclass.com/DS/U3_T1.html

export class TreeNode {
	name: string;
	children: Array<TreeNode>;

	constructor(name: string = '', children: Array<TreeNode> = new Array<TreeNode>() ) {
		this.name = name;
		this.children = children;
	}

	isLeaf(): boolean {
		return this.children.length === 0;
	}
}
