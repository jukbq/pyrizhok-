import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FavoritesComponent } from './favorites/favorites.component';



@NgModule({
  declarations: [
    PersonalDataComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule, UserRoutingModule, SharedModule
  ]
})
export class UserModule { }
