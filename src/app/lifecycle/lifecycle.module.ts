import { LifeCycleRoutingModule } from './lifecycle-routing.module';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ChildComponent, ParentComponent],
  imports: [LifeCycleRoutingModule, CommonModule],
})
export class LifecycleModule {}
