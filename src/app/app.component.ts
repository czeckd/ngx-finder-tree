import { Component, OnInit } from '@angular/core';

import { TreeNode } from './finder-tree/models/tree-node';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	root: TreeNode;

	private _trunk  = [ 'A', 'B', 'C' ];
	private _branch = [ 'a', 'b', 'c', 'd' ];
	private _twig   = [ 'i', 'ii', 'iii', 'iv', 'v' ];
	private _leaf   = [ '1', '2', '3' ];

	showRoot = false;

	constructor() {
	}

	ngOnInit() {
		this.root = new TreeNode('root');
		for (let tr = 0; tr < this._trunk.length; tr += 1) {
			const trunk = new TreeNode(this._trunk[tr]);
			for (let br = 0; br < this._branch.length; br += 1) {
				const branch = new TreeNode(this._trunk[tr] + '.' + this._branch[br]);
				for (let tw = 0; tw < this._twig.length; tw += 1) {
					const twig = new TreeNode(this._trunk[tr] + '.' + this._branch[br] + '.' + this._twig[tw],
						this._leaf.map(l =>	new TreeNode(this._trunk[tr] + '.' + this._branch[br] + '.' + this._twig[tw] + '.' + l)));
					branch.children.push(twig);
				}
				trunk.children.push(branch);
			}
			this.root.children.push(trunk);
		}
	}
}
