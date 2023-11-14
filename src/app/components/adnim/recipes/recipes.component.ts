import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { СuisineResponse } from 'src/app/shared/interfaces/cuisine';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { RecipesResponse } from 'src/app/shared/interfaces/recipes';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { CuisineService } from 'src/app/shared/service/cuisine/cuisine.service';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';
import { RecipesService } from 'src/app/shared/service/recipes/recipes.service';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { IngredientComponent } from 'src/app/modal/ingredient/ingredient.component';
import { AddDishesComponent } from 'src/app/modal/recipe-elements/add-dishes/add-dishes.component';
import { AddCategoriesDishesComponent } from 'src/app/modal/recipe-elements/add-categories-dishes/add-categories-dishes.component';
import { AddCuisineComponent } from 'src/app/modal/recipe-elements/add-cuisine/add-cuisine.component';
import { AddToolsComponent } from 'src/app/modal/recipe-elements/add-tools/add-tools.component';

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
  public cuisine: Array<СuisineResponse> = [];
  public filteredCategories: any[] = [];
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
  public formStep = 3;
  public ingredients: any[] = [];
  public numberServings = 1
  group: any;

  constructor(
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private dishessService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    private cuisineService: CuisineService,
    private methodCookin: MethodCookinService,
    private toolsService: ToolsService,
    public dialog: MatDialog,

    private storsge: Storage

  ) { };

  ngOnInit(): void {
    this.initRecipeForm();
    this.getDishes()
    this.getCategoriesDishes()
    this.getRecipes();
    this.getCuisine();
    this.getTools();

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
      amountProdukt: [null, Validators.required],
      unitsMeasure: [null, Validators.required],
      ingredients: [null, Validators.required],
      notes: [null],


      //Сторінка 4
      steps: [null, Validators.required],
    })




  }

  //Нова сторынка рецепта
  nextStep(step: string) {
    if (step === 'two') {
      if (this.recipesForm.get('dishes')?.value &&
        this.recipesForm.get('categoriesDishes')?.value &&
        this.recipesForm.get('recipeKeys')?.value &&
        this.recipesForm.get('cuisine')?.value &&
        this.recipesForm.get('difficultyPreparation')?.value &&
        this.recipesForm.get('bestSeason')?.value) {
        this.formStep += 1;
      } else {
        this.validError();
      }
    } else if (step === 'three') {
      if (this.recipesForm.get('recipeTitle')?.value &&
        this.recipesForm.get('descriptionRecipe')?.value) {
        this.formStep += 1;
      } else {
        this.validError();
      }
    }
  }
  //Помилка валыдації
  validError() {
    Swal.fire({
      icon: "error",
      title: "Виникла помилка! ",
      text: "Заповніть всі обов`язкові поля!",
    });
  }


  back() {
    this.formStep -= 1;
  }

  delingr(index: void) {

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

  // Отримання даних з сервера
  getCuisine(): void {
    this.cuisineService.getAll().subscribe((data) => {
      this.cuisine = data as СuisineResponse[];
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
    } else {
      this.filteredCategories = [];
    }
  }

  //Створення або редагування рецепта
  creatRecipe() {

    /*    if (this.edit_status) {
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
       this.recipes_form = false; */
  }

  resetForm() {
    this.recipesForm.reset();
  }



  // Відкриття модального вікна для додавання або редагування адреси
  addModal(action: string, object: any): void {
    if (action === 'dishes') {
      const dialogRef = this.dialog.open(AddDishesComponent, {
        panelClass: 'add_dishes',
        data: { action, object }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getDishes();
      });
    }

    if (action === 'categoriesDishes') {
      const dialogRef = this.dialog.open(AddCategoriesDishesComponent, {
        panelClass: 'сategoriesDishes_modal_dialog',
        data: { action, object }

      });

      dialogRef.afterClosed().subscribe(() => {
        this.getDishes();
        this.getCategoriesDishes();
      });
    }

    if (action === 'cuisine') {
      const dialogRef = this.dialog.open(AddCuisineComponent, {
        panelClass: 'сategoriesDishes_modal_dialog',
        data: { action, object }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getCuisine();
      });
    }

    if (action === 'methodCooking') {
      const dialogRef = this.dialog.open(AddCuisineComponent, {
        panelClass: 'methodCooking_modal_dialog',
        data: { action, object }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getMethodCookin();
      });
    }
    if (action === 'tools') {
      const dialogRef = this.dialog.open(AddToolsComponent, {
        panelClass: 'add_tools',
        data: { action, object }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.getTools();
      });
    }
  }


  addIng(action: 'add' | 'edit'): void {
    if (action === 'add') {
      const dialogRef = this.dialog.open(IngredientComponent, {
        panelClass: 'ingModsl',
        data: { action }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.ingredients = result.ingredients;
          this.numberServings = result.numberServings;
          this.getMethodCookin();
        }
      });

    } else if (action === 'edit' && this.ingredients.length > 0) {
      const dialogRef = this.dialog.open(IngredientComponent, {
        panelClass: 'ingModsl',
        data: { action, ingredients: this.ingredients, numberServings: this.numberServings }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.ingredients = result.ingredients;
          this.numberServings = result.numberServings;
          this.getMethodCookin();
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Виникла помилка! ",
        text: "Не введено ні одного інгидієнта!",
      });
    }


  }


  //ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ
  upload(event: any): void {
    const file = event.target.files[0];
    this.loadFIle('recipe-main-images', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.recipesForm.patchValue({
            mainImage: data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storsge, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wtong file');
    }
    return Promise.resolve(url);
  }

  deleteImage(): void {
    const task = ref(this.storsge, this.valueByControl('mainImage'));
    console.log(task);
    deleteObject(task).then(() => {
      this.uploadPercent = 0;
      this.recipesForm.patchValue({
        mainImage: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.recipesForm.get(control)?.value;
  }


}
