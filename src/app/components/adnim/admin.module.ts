import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecipesComponent } from './recipes/recipes.component';
import { DishesComponent } from './dishes/dishes.component';
import { CategoriesDishesComponent } from './categories-dishes/categories-dishes.component';
import { CuisineComponent } from './cuisine/cuisine.component';
import { ProductsComponent } from './products/products.component';



@NgModule({
  declarations: [
    RecipesComponent,
    DishesComponent,
    CategoriesDishesComponent,
    CuisineComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, SharedModule
  ]
})
export class AdminModule { }
