import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { FinderTreeModule } from './finder-tree/finder-tree.module';

import { AppComponent } from './app.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		FinderTreeModule,
	],
	declarations: [
		AppComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
