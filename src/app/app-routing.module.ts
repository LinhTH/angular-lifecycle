import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/lifecycle' },
  {
    path: 'lifecycle',
    loadChildren: () =>
      import('./life-cycle/lifecycle.module').then((m) => m.LifecycleModule),
  },
  //   {
  //     path: 'login',
  //     loadChildren: () =>
  //       import('./pages/login/login.module').then((m) => m.LoginModule),
  //   },
  //   {
  //     path: 'signup',
  //     loadChildren: () =>
  //       import('./pages/signup/signup.module').then((m) => m.SignupModule),
  //   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
