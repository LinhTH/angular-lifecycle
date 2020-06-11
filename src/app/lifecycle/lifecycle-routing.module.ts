import { LifeCyclePageComponent } from './lifecycle-page.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: LifeCyclePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifeCycleRoutingModule {}
