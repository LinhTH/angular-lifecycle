import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/lifecycle' },
  {
    path: 'lifecycle',
    loadChildren: () =>
      import('./lifecycle/lifecycle.module').then((m) => m.LifecycleModule),
  },
  {
    path: 'spy-directive',
    loadChildren: () =>
      import('./spy-directive/spy-directive.module').then(
        (m) => m.SpyDirectiveModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
