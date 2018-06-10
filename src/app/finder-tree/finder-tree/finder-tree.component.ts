import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Inject, Input,
	OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';

import { cloneDeep } from 'lodash';

import { PanelEvent } from '../models/panel-event';
import { FinderTreeNode } from '../models/finder-tree-node';

import { FinderTreePanelComponent } from '../finder-tree-panel/finder-tree-panel.component';

@Component({
	selector: 'czeckd-finder-tree',
	templateUrl: './finder-tree.component.html',
	styleUrls: ['./finder-tree.component.scss']
})
export class FinderTreeComponent implements OnChanges, OnDestroy {
	@ViewChild('frame', { read: ViewContainerRef }) frame: ViewContainerRef;
	@Input() tree: FinderTreeNode;
	@Input() showRoot = false;

	@Output() openNode = new EventEmitter<string>();
	@Output() closeNode = new EventEmitter<string>();

	finder: FinderTreeNode;

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
			this.finder = cloneDeep(this.tree);

			// Clean-up existing panels.
			this.panelsById.forEach(p => p.destroy());
			this.addRoot();
			this.addPanel(this.finder.children, (this.showRoot ? false : true));
		}

		if (changes.showRoot) {
			if (this.panelsById.has(0)) {
				const root = this.panelsById.get(0);
				(<FinderTreePanelComponent>root.instance).display = this.showRoot;
				(<FinderTreePanelComponent>root.instance).list.map(c => c.open = this.showRoot);

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
		(<FinderTreePanelComponent>panel.instance).display = (children.length ? show : false);

		this.panelsById.set(this.panelCount, panel);

		return panel;
	}

	openChildren(pe: PanelEvent) {
		const node = pe.node;
		const id = pe.id;
		const childPanelId = id + 1;

		this.openNode.emit(node.name);

		if (this.panelsById.has(childPanelId)) {
			const panel = this.panelsById.get(childPanelId);
			node.children.map(c => c.open = false);
			(<FinderTreePanelComponent>panel.instance).list = node.children;
			(<FinderTreePanelComponent>panel.instance).display = (node.children.length ? true : false);
			this.hidePanels(id + 1);
		} else {
			const panel = this.addPanel(node.children);
		}
		if (node.open) {
			this.closeSiblings(pe);
		}
	}

	closeChildren(pe: PanelEvent) {
		this.closeNode.emit(pe.node.name);
		this.hidePanels(pe.id);
	}

	closeSiblings(pe: PanelEvent) {
		const panel = this.panelsById.get(pe.id);
		(<FinderTreePanelComponent>panel.instance).list.map(c => {
			if (c != pe.node) {
				c.open = false
			}
		});
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
