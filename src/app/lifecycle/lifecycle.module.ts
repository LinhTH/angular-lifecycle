import { DisabledParentComponent } from './disabled-parent/disabled-parent.component';
import { LifeCyclePageComponent } from './lifecycle-page.component';
import { LifeCycleRoutingModule } from './lifecycle-routing.module';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChildComponent,
    ParentComponent,
    LifeCyclePageComponent,
    DisabledParentComponent,
  ],
  imports: [LifeCycleRoutingModule, CommonModule],
})
export class LifecycleModule {}
