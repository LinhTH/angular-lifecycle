import { ParentComponent } from './life-cycle/parent/parent.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChildComponent } from './life-cycle/child/child.component';

@NgModule({
  declarations: [AppComponent, ChildComponent, ParentComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
