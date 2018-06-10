import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
	Inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';

import { cloneDeep } from 'lodash';

import { PanelEvent } from '../models/panel-event';
import { FinderTreeNode } from '../models/finder-tree-node';
import { TreeNode } from '../models/tree-node';

import { FinderTreePanelComponent } from '../finder-tree-panel/finder-tree-panel.component';

@Component({
	selector: 'czeckd-finder-tree',
	templateUrl: './finder-tree.component.html',
	styleUrls: ['./finder-tree.component.scss']
})
export class FinderTreeComponent implements OnChanges, OnDestroy {
	@ViewChild('frame', { read: ViewContainerRef }) frame: ViewContainerRef;
	@Input() tree: TreeNode;
	@Input() showRoot = false;

	finder: FinderTreeNode;
	fauxRoot: FinderTreeNode;

	private panelCount = 0;
	private factory: ComponentFactory<FinderTreePanelComponent>;
	private panelsById = new Map<number, ComponentRef<FinderTreePanelComponent>>();

	constructor(@Inject(ComponentFactoryResolver) resolver, private vcRef: ViewContainerRef) {
		this.factory = resolver.resolveComponentFactory(FinderTreePanelComponent);
	}

	ngOnDestroy() {
		this.panelsById.forEach(p => p.destroy());
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.tree) {
			this.finder = new FinderTreeNode(cloneDeep(this.tree));

			// Clean-up existing panels.
			this.panelsById.forEach(p => p.destroy());
			this.addRoot();
			this.addPanel(this.finder.children, (this.showRoot ? false : true));
		}

		if (changes.showRoot) {
			if (this.panelsById.has(0)) {
				const root = this.panelsById.get(0);
				(<FinderTreePanelComponent>root.instance).display = (this.showRoot ? true : false);

				if (!this.showRoot && this.panelsById.has(1)) {
					const panel = this.panelsById.get(1);
					(<FinderTreePanelComponent>panel.instance).display = true;
				}
			}
		}
	}

	private addRoot(): ComponentRef<FinderTreePanelComponent> {
		if (this.panelsById.has(0)) {
			const panel = this.panelsById.get(0);
			(<FinderTreePanelComponent>panel.instance).list = new Array<FinderTreeNode>(this.finder);
			return panel;
		} else {
			const panel: ComponentRef<FinderTreePanelComponent> = this.frame.createComponent(this.factory);

			(<FinderTreePanelComponent>panel.instance).id = this.panelCount;	// Should always be 0.
			(<FinderTreePanelComponent>panel.instance).list = new Array<FinderTreeNode>(this.finder);
			(<FinderTreePanelComponent>panel.instance).openChildren.subscribe(pe => this.openChildren(pe));
			(<FinderTreePanelComponent>panel.instance).closeChildren.subscribe(pe => this.closeChildren(pe));

			this.panelsById.set(this.panelCount, panel);

			return panel;
		}
	}

	private addPanel(children: Array<FinderTreeNode>, show: boolean = true): ComponentRef<FinderTreePanelComponent> {
		const panel: ComponentRef<FinderTreePanelComponent> = this.frame.createComponent(this.factory);
		this.panelCount += 1;

		(<FinderTreePanelComponent>panel.instance).id = this.panelCount;
		(<FinderTreePanelComponent>panel.instance).list = children;
		(<FinderTreePanelComponent>panel.instance).openChildren.subscribe(pe => this.openChildren(pe));
		(<FinderTreePanelComponent>panel.instance).closeChildren.subscribe(pe => this.closeChildren(pe));
		(<FinderTreePanelComponent>panel.instance).display = show;

		this.panelsById.set(this.panelCount, panel);

		return panel;
	}

	openChildren(pe: PanelEvent) {
		const node = pe.node;
		const id = pe.id;
		const childPanelId = id + 1;

		if (this.panelsById.has(childPanelId)) {
			const panel = this.panelsById.get(childPanelId);
			(<FinderTreePanelComponent>panel.instance).list = node.children;
			(<FinderTreePanelComponent>panel.instance).display = true;
			this.hidePanels(id + 1);
		} else {
			const panel = this.addPanel(node.children);
		}
	}

	closeChildren(pe: PanelEvent) {
		this.hidePanels(pe.id);
	}

	hidePanels(base: number) {
		const keys = Array.from(this.panelsById.keys());
		keys.map(key => {
			if (key > base) {
				const panel = this.panelsById.get(key);
				(<FinderTreePanelComponent>panel.instance).display = false;
			}
		});
	}
}
