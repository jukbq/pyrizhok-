import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RecipeElementsComponent } from 'src/app/modal/recipe-elements/recipe-elements.component';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { RecipesResponse } from 'src/app/shared/interfaces/recipes';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';
import { RecipesService } from 'src/app/shared/service/recipes/recipes.service';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';

const dpList: any[] = [
  { name: 'Базовий рецепт', list: 'light' },
  { name: 'Середній рівень', list: 'medium' },
  { name: 'Складний рецепт', list: 'hard' },
]

const season: any[] = [
  { name: 'Зима', list: 'winter' },
  { name: 'Весна', list: 'spring' },
  { name: 'Літо', list: 'summer' },
  { name: 'Осінь', list: 'Autumn' },

]

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
  public recipes_form = false;
  public recipesForm!: FormGroup;

  public recipes: Array<RecipesResponse> = [];
  public dishes: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public filteredCategories: any[] = [];
  public cuisine = [];
  public methodCooking: Array<MethodCookinResponse> = [];
  public tools: Array<ToolsResponse> = [];

  public selectDishes = new FormControl('');

  public difficultyPreparation: any[] = dpList;
  public bestSeason: any[] = season;
  public edit_status = false;
  private recipeID!: number | string;
  public selecteddishes: DishesResponse[] = [];
  public seleCategoriesDishes: CategoriesDishesResponse[] = [];
  public uploadPercent!: number;
  public formStep = 1;

  constructor(
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private dishessService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    private methodCookin: MethodCookinService,
    private toolsService: ToolsService,
    public dialog: MatDialog,

  ) { };

  ngOnInit(): void {
    this.initRecipeForm();
    this.getDishes()
    this.getCategoriesDishes()
    this.getRecipes();
  }

  //Ініціалізація форми
  initRecipeForm(): void {
    this.recipesForm = this.formBuilder.group({
      //Сторінка 1
      dishes: [null, Validators.required],
      categoriesDishes: [null, Validators.required],
      recipeKeys: [null, Validators.required],
      cuisine: [null, Validators.required],
      autor: [null],
      methodCooking: [null],
      tools: [null],
      difficultyPreparation: [null, Validators.required],
      bestSeason: [null, Validators.required],

      //Сторінка 2
      recipeTitle: [null, Validators.required],
      recipeSubtitles: [null],
      descriptionRecipe: [null, Validators.required],
      mainImage: [null],
      focusKeyword: [null],
      keywords: [null],

      //Сторінка 3
      numberServings: [1],
      quantityIngredients: [null, Validators.required],
      unitsMeasure: [null, Validators.required],
      ingredients: [null, Validators.required],
      notes: [null],


      //Сторінка 4
      steps: [null, Validators.required],
    })
  }

  //Отримання списку страв
  getDishes(): void {
    this.dishessService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }

  //Отримання списку категорій страв
  getCategoriesDishes(): void {
    this.categoriesDishesService.getAll().subscribe((data) => {
      this.categoriesDishes = data as CategoriesDishesResponse[];
    });
  }

  //Доодати методи приготування
  getMethodCookin() {
    this.methodCookin.getAll().subscribe((data) => {
      this.methodCooking = data as MethodCookinResponse[];
    });
  }
  //Доодати інструменти
  getTools() {
    this.toolsService.getAll().subscribe((data) => {
      this.methodCooking = data as MethodCookinResponse[];
    });
  }

  //Отримання рецептів
  getRecipes(): void {
    this.recipesService.getAll().subscribe((data) => {
      this.recipes = data as RecipesResponse[];
      if (this.selecteddishes.length > 0) {
        this.recipes = this.recipes.filter((recipes) =>
          this.selecteddishes.some((dishes) => dishes.id === recipes.dishes.id)
        );
      }

      if (this.seleCategoriesDishes.length > 0) {
        this.recipes = this.recipes.filter((recipes) =>
          this.seleCategoriesDishes.some(
            (categoriesDishes) => categoriesDishes.id === recipes.categoriesDishes.id
          )
        );
      }
    });
  }

  //Виборка категорій
  onDishesSelection() {
    const selectedCategories = this.recipesForm.value.dishes.dishesName
    if (selectedCategories) {
      this.filteredCategories = this.categoriesDishes.filter(categories =>
        selectedCategories.includes(categories.dishes.dishesName));
      console.log(this.filteredCategories);
    } else {
      this.filteredCategories = [];
    }
  }

  //Створення або редагування рецепта
  creatRecipe() {
    if (this.edit_status) {
      this.recipesService
        .editrecipes(this.recipesForm.value, this.recipeID as string)
        .then(() => {
          this.getRecipes();
          this.uploadPercent = 0;
        });
    } else {
      this.recipesService.addRecipess(this.recipesForm.value).then(() => {
        this.getRecipes();
        this.uploadPercent = 0;
      });
    }

    this.recipesForm.reset();
    this.edit_status = false;
    this.recipes_form = false;
  }

  resetForm() {
    this.recipesForm.reset();
  }


  // Відкриття модального вікна для додавання або редагування адреси
  addressModal(action: string): void {
    const dialogRef = this.dialog.open(RecipeElementsComponent, {
      panelClass: 'recipe_element_dialog',
      data: { action },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDishes()
      this.getCategoriesDishes()
    });
  }


}
