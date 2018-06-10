import { Component, OnInit } from '@angular/core';

import { FinderTreeNode } from './finder-tree/models/finder-tree-node';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	root: FinderTreeNode;

	private _trunk  = [ 'A', 'B', 'C', 'D', 'E', 'F' ];
	private _branch = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' ];
	private _twig   = [ 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi' ];
	private _leaf   = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ];

	showRoot = false;
	action = '';

	constructor() {
	}

	ngOnInit() {
		this.root = new FinderTreeNode('root');
		const trunks = this.random() / 2;
		for (let tr = 0; tr < trunks; tr += 1) {
			const trunk = new FinderTreeNode(this._trunk[tr]);
			const branches = this.random();
			for (let br = 0; br < branches; br += 1) {
				const branch = new FinderTreeNode(this._trunk[tr] + '.' + this._branch[br]);
				const twigs = this.random();
				for (let tw = 0; tw < twigs; tw += 1) {
					const leaves = this._leaf.slice(0, this.random());
					const twig = new FinderTreeNode(this._trunk[tr] + '.' + this._branch[br] + '.' + this._twig[tw],
						leaves.map(l =>	new FinderTreeNode(this._trunk[tr] + '.' + this._branch[br] + '.' + this._twig[tw] + '.' + l)));
					branch.children.push(twig);
				}
				trunk.children.push(branch);
			}
			this.root.children.push(trunk);
		}
	}

	random(): number {
		return Math.floor((Math.random() * 11));
	}

	opened(name: string) {
		this.action = 'opened: ' + name;
	}

	closed(name: string) {
		this.action = 'closed: ' + name;
	}
}
