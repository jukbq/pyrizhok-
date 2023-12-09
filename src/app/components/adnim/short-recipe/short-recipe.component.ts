import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoriesDishesComponent } from 'src/app/modal/recipe-elements/add-categories-dishes/add-categories-dishes.component';
import { AddCuisineComponent } from 'src/app/modal/recipe-elements/add-cuisine/add-cuisine.component';
import { AddDishesComponent } from 'src/app/modal/recipe-elements/add-dishes/add-dishes.component';
import { AddMethodCookingComponent } from 'src/app/modal/recipe-elements/add-method-cooking/add-method-cooking.component';
import { AddToolsComponent } from 'src/app/modal/recipe-elements/add-tools/add-tools.component';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { СuisineResponse } from 'src/app/shared/interfaces/cuisine';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { ShortRecipesResponse } from 'src/app/shared/interfaces/short-recipes';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { CuisineService } from 'src/app/shared/service/cuisine/cuisine.service';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';
import { ShortRecipeService } from 'src/app/shared/service/short-recipe/short-recipe.service';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { IngredientComponent } from 'src/app/modal/ingredient/ingredient.component';
import Swal from 'sweetalert2';
import { FavoritesService } from 'src/app/shared/service/favorites/favorites.service';

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
  selector: 'app-short-recipe',
  templateUrl: './short-recipe.component.html',
  styleUrls: ['./short-recipe.component.scss']
})
export class ShortRecipeComponent {
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public dishesList: Array<DishesResponse> = [];
  public cuisineList: Array<СuisineResponse> = [];
  public recipes: Array<ShortRecipesResponse> = [];
  public methodCookingList: Array<MethodCookinResponse> = [];
  public toolsList: Array<ToolsResponse> = [];

  public selecteddishes: DishesResponse[] = [];
  public seleCategoriesDishes: CategoriesDishesResponse[] = [];
  public difficultyPreparationList: any[] = dpList;
  public bestSeasonList: any[] = season;
  public filteredCategories: any[] = [];
  public recipes_form = false;
  public recipesForm!: FormGroup;
  public customer: any
  public uploadPercent!: number;
  public ingredients: any[] = [];
  public numberServings = 1
  public edit_status = false;
  private recipeID!: number | string;

  public isHoveredLight: boolean = false;
  public isHoveredMedium: boolean = false;
  public isHoveredHard: boolean = false;
  public uid!: string;
  public favoriteProducts: string[] = [];
  public shareMenu = false;

  constructor(
    private formBuilder: FormBuilder,
    private shortRecipesService: ShortRecipeService,
    private dishessService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    private cuisineService: CuisineService,
    private methodCookin: MethodCookinService,
    private toolsService: ToolsService,
    public dialog: MatDialog,
    private storsge: Storage,
    private recipesService: ShortRecipeService,
    private localStorge: LocalStorageService,
    private favoritesService: FavoritesService,
  ) { };

  ngOnInit(): void {
    this.customer = this.localStorge.getData('curentUser');
    if (this.customer && this.customer.uid) {
      this.uid = this.customer.uid;
    }
    if (this.uid) {
      this.favoritesService
        .getFavoritesByUser(this.uid)
        .subscribe((favorites) => {
          this.favoriteProducts = favorites.map(
            (favorite) => favorite.productId
          );
        });
    }

    this.initRecipeForm()
    this.getDishes();
    this.getCategoriesDishes();
    this.getRecipes();
    this.getCuisine();
    this.getMethodCookin();
    this.getTools();


  }


  //Ініціалізація форми
  initRecipeForm(): void {
    this.recipesForm = this.formBuilder.group({
      dishes: [null, Validators.required],
      categoriesDishes: [null, Validators.required],
      recipeKeys: [null, Validators.required],
      cuisine: [null, Validators.required],
      autor: [null],
      methodCooking: [null],
      tools: [null],
      difficultyPreparation: [null, Validators.required],
      bestSeason: [null, Validators.required],
      recipeTitle: [null, Validators.required],
      descriptionRecipe: [null, Validators.required],
      mainImage: [null],
      focusKeyword: [null],
      keywords: [null],
      numberServings: [1],
      ingredients: [null, Validators.required],
      rating: 0


    });
  }

  //Отримання рецептів
  getRecipes(): void {
    this.shortRecipesService.getAll().subscribe((data) => {
      this.recipes = data as ShortRecipesResponse[];
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

  //Доодати методи приготування
  getMethodCookin() {
    this.methodCookin.getAll().subscribe((data) => {
      this.methodCookingList = data as MethodCookinResponse[];
    });
  }

  //Доодати інструменти
  getTools() {
    this.toolsService.getAll().subscribe((data) => {
      this.toolsList = data as ToolsResponse[];
    });
  }

  //Отримання списку страв
  getDishes(): void {
    this.dishessService.getAll().subscribe((data) => {
      this.dishesList = data as DishesResponse[];
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
      this.cuisineList = data as СuisineResponse[];
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


  resetForm() {
    this.recipesForm.reset();
  }


  //Додати інгридієнти 
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
          this.recipesForm.patchValue({
            numberServings: this.numberServings,
            ingredients: this.ingredients,
          })
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
      const dialogRef = this.dialog.open(AddMethodCookingComponent, {
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


  //ЗАВАНТАЖЕННЯ ЗОБРАЖЕНЬ
  upload(event: any): void {
    const file = event.target.files[0];
    this.loadFIle('ірщке-recipe-main-images', file.name, file)
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

  // Перевірка, чи є товар у списку улюблених користувача
  isFavorite(product: any): boolean {
    return this.favoriteProducts.includes(product.id);
  }



  //додати в обране
  addFavorites(poduct: any): void {
    const productId = poduct.id;

    if (this.isFavorite(poduct)) {
      console.log(poduct);

      // Якщо товар вже є у списку улюблених, видаляємо його
      this.favoritesService
        .removeFromFavorites(this.uid, productId)
        .then(() => {
          this.favoriteProducts = this.favoriteProducts.filter(
            (favProductId) => favProductId !== productId
          );
        });
    } else {
      // Якщо товар не є у списку улюблених, додаємо його
      this.favoritesService.addToFavorites(this.uid, productId).then(() => {
        this.favoriteProducts.push(productId);
      });
    }
  }



  shareMenuActive() {
    this.shareMenu = true;
  }
  onMouseLeave() {
    this.shareMenu = false;
  }



  creatRecipe() {
    if (this.edit_status) {
      this.recipesService.editShortRecipes(this.recipesForm.value, this.recipeID as string)
        .then(() => {
          this.getRecipes();
          this.uploadPercent = 0;
        });
    } else {

      console.log(this.recipesForm.value);

      this.recipesService.addShortRecipess(this.recipesForm.value).then(() => {
        this.getRecipes();
        this.uploadPercent = 0;
      });

    }
    this.recipesForm.reset();
    this.edit_status = false;
    this.recipes_form = false;


  }
}
