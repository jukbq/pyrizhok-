import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
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


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dishes', component: DishesComponent },
      { path: 'categories', component: CategoriesDishesComponent },
      { path: 'cuisine', component: CuisineComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'productCategory', component: ProductCategoryComponent },
      { path: 'methodCooking', component: MethodCookingComponent },
      { path: 'tools', component: ToolsComponent },
      { path: 'units', component: UnitsComponent },
      { path: 'short-recipes', component: ShortRecipeComponent },


      { path: '', pathMatch: 'full', redirectTo: 'action' },
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
