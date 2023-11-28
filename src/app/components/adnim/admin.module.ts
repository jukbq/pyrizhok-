import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecipesComponent } from './recipes/recipes.component';
import { DishesComponent } from './dishes/dishes.component';
import { CategoriesDishesComponent } from './categories-dishes/categories-dishes.component';
import { CuisineComponent } from './cuisine/cuisine.component';
import { ProductsComponent } from './products/products.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { MethodCookingComponent } from './method-cooking/method-cooking.component';
import { ToolsComponent } from './tools/tools.component';
import { UnitsComponent } from './units/units.component';
import { ShortRecipeComponent } from './short-recipe/short-recipe.component';



@NgModule({
  declarations: [
    RecipesComponent,
    DishesComponent,
    CategoriesDishesComponent,
    CuisineComponent,
    ProductsComponent,
    ProductCategoryComponent,
    MethodCookingComponent,
    ToolsComponent,
    UnitsComponent,
    ShortRecipeComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, SharedModule
  ]
})
export class AdminModule { }
