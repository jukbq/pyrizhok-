import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { FavoritesComponent } from './favorites/favorites.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'personal-data', component: PersonalDataComponent },
      { path: 'favorites', component: FavoritesComponent },





      { path: '', pathMatch: 'full', redirectTo: 'personal-data' },
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
