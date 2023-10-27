import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecipesComponent } from './recipes/recipes.component';
import { DishesComponent } from './dishes/dishes.component';



@NgModule({
  declarations: [
    RecipesComponent,
    DishesComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, SharedModule
  ]
})
export class AdminModule { }
