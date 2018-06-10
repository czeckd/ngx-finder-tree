import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatDividerModule, MatIconModule, MatListModule } from '@angular/material';

import { FinderTreeComponent } from './finder-tree/finder-tree.component';
import { FinderTreePanelComponent } from './finder-tree-panel/finder-tree-panel.component';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatListModule
	],
	declarations: [
		FinderTreeComponent,
		FinderTreePanelComponent
	],
	exports: [
		FinderTreeComponent
	],
	entryComponents: [
		FinderTreePanelComponent
	]
})
export class FinderTreeModule { }
