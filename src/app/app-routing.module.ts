import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './modal/sign-up/sign-up.component';
import { SignInComponent } from './modal/sign-in/sign-in.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/adnim/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'user', loadChildren: () =>
      import('./components/user/user.module').then((m) => m.UserModule)
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
