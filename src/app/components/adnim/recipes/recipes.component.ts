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
import { AddMethodCookingComponent } from 'src/app/modal/recipe-elements/add-method-cooking/add-method-cooking.component';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';

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

interface InstructionStep {
  title: string;
  steps: {
    name: string;
    description: string;
    image?: string | undefined;
  }[];
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
  public recipes_form = false;
  public recipesForm!: FormGroup;
  public dishes: string | null = null;
  public recipes: Array<RecipesResponse> = [];
  public dishesList: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public cuisineList: Array<СuisineResponse> = [];
  public filteredCategories: any[] = [];
  public methodCookingList: Array<MethodCookinResponse> = [];
  public toolsList: Array<ToolsResponse> = [];
  public selectDishes = new FormControl('');
  public difficultyPreparationList: any[] = dpList;
  public bestSeasonList: any[] = season;
  public edit_status = false;
  private recipeID!: number | string;
  public selecteddishes: DishesResponse[] = [];
  public seleCategoriesDishes: CategoriesDishesResponse[] = [];
  public uploadPercent!: number;
  public formStep = 5;
  public ingredients: any[] = [];
  public instructions: InstructionStep[] = [];
  public numberServings = 1
  public group: any;
  public steps: any = []
  public customer: any





  constructor(
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private dishessService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    private cuisineService: CuisineService,
    private methodCookin: MethodCookinService,
    private toolsService: ToolsService,
    public dialog: MatDialog,
    private storsge: Storage,
    private localStorge: LocalStorageService

  ) { };

  ngOnInit(): void {
    this.customer = this.localStorge.getData('curentUser');
    this.steps = this.localStorge.getData('steps');

    if (this.steps) {
      this.recipesForm = this.formBuilder.group({
        dishes: [this.steps[0].dishes],
        categoriesDishes: [this.steps[0].categoriesDishes],
        recipeKeys: [this.steps[0].recipeKeys],
        cuisine: [this.steps[0].cuisine],
        autor: [this.customer.firstName],
        methodCooking: [this.steps[0].methodCooking],
        tools: [this.steps[0].tools],
        difficultyPreparation: [this.steps[0].difficultyPreparation],
        bestSeason: [this.steps[0].bestSeason],

        recipeTitle: [this.steps[1].recipeTitle],
        recipeSubtitles: [this.steps[1].recipeSubtitles],
        descriptionRecipe: [this.steps[1].descriptionRecipe],
        mainImage: [this.steps[1].mainImage],
        focusKeyword: [this.steps[1].focusKeyword],
        keywords: [this.steps[1].keywords],

        numberServings: [this.steps[2].numberServings],
        ingredients: [this.steps[2].ingredients],

        instructions: [this.steps[3].instructions],
      });
      console.log(this.recipesForm.value);

    } else {
      this.initRecipeForm();
    }

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
      rating: [0],

      //Сторінка 2
      recipeTitle: [null, Validators.required],
      recipeSubtitles: [null],
      descriptionRecipe: [null, Validators.required],
      mainImage: [null],
      focusKeyword: [null],
      keywords: [null],

      //Сторінка 3
      numberServings: [1],
      ingredients: [null, Validators.required],



      //Сторінка 4
      instructions: [null, Validators.required],
    });
  }



  //Нова сторынка рецепта
  nextStep(step: string) {
    let steps = this.localStorge.getData('steps') || [];
    const formValues = this.recipesForm.value;
    if (step === 'two') {
      if (formValues.dishes &&
        formValues.categoriesDishes &&
        formValues.recipeKeys &&
        formValues.cuisine &&
        formValues.difficultyPreparation &&
        formValues.bestSeason) {
        if (steps.length > 0) {
          steps.splice(0, 1)
        }
        steps.splice(0, 0, {
          dishes: formValues.dishes,
          categoriesDishes: formValues.categoriesDishes,
          recipeKeys: formValues.recipeKeys,
          cuisine: formValues.cuisine,
          methodCooking: formValues.methodCooking,
          tools: formValues.tools,
          difficultyPreparation: formValues.difficultyPreparation,
          bestSeason: formValues.bestSeason
        });
        this.formStep += 1;
      } else {
        this.validError();
      }
    } else if (step === 'three') {
      if (this.recipesForm.get('recipeTitle')?.value &&
        this.recipesForm.get('descriptionRecipe')?.value) {
        if (steps.length > 0) {
          steps.splice(1, 1)
        }
        steps.splice(1, 0, {
          recipeTitle: formValues.recipeTitle,
          recipeSubtitles: formValues.recipeSubtitles,
          descriptionRecipe: formValues.descriptionRecipe,
          mainImage: formValues.mainImage,
          focusKeyword: formValues.focusKeyword,
          keywords: formValues.keywords
        });
        this.formStep += 1;
      } else {
        this.validError();
      }
    } else if (step === 'four') {
      if (this.recipesForm.get('ingredients')?.value) {
        if (steps.length > 0) {
          steps.splice(2, 1)
        }
        steps.splice(2, 0, {
          numberServings: formValues.numberServings,
          ingredients: formValues.ingredients
        });
        this.formStep += 1;
      } else {
        this.validError();
      }
    } else if (step === 'five') {
      if (this.instructions.length > 0) {
        this.recipesForm.patchValue({
          instructions: this.instructions
        })

        if (steps.length > 0) {
          steps.splice(3, 1)
        }
        steps.splice(3, 0, { instructions: this.instructions });
        this.formStep += 1;
      } else {
        this.validError();
      }


    }
    this.localStorge.saveData('steps', steps);
    this.steps = this.localStorge.getData('steps')

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



  //Кроки рецепта
  addInstructionStep() {
    this.instructions.push({
      title: '',
      steps: [{ name: '', description: '', image: '' }]
    });
  };

  addNewStep(index: number) {
    this.instructions[index].steps.push({ name: '', description: '', image: '' });
  }

  addNewGroup() {
    this.instructions.push({
      title: '',
      steps: [{ name: '', description: '', image: '' }]
    });
  }

  stepUpload(event: any, stepIndex: number, subStepIndex: number) {
    const file = event.target.files[0];
    this.steploadFile('recipe-step-images', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.instructions[stepIndex].steps[subStepIndex].image = data;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }


  async steploadFile(
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
      console.log('Wrong file');
    }
    return Promise.resolve(url);
  }


  deleteStepImage(stepIndex: number, subStepIndex: number) {
    this.instructions[stepIndex].steps[subStepIndex].image = '';
    // Логіка для видалення зображення, наприклад, встановлення порожнього рядка
  }


  //Створення або редагування рецепта
  creatRecipe() {
    if (this.steps) {
      this.recipesForm = this.formBuilder.group({
        dishes: [this.steps[0].dishes],
        categoriesDishes: [this.steps[0].categoriesDishes],
        recipeKeys: [this.steps[0].recipeKeys],
        cuisine: [this.steps[0].cuisine],
        autor: [this.customer.firstName],
        methodCooking: [this.steps[0].methodCooking],
        tools: [this.steps[0].tools],
        difficultyPreparation: [this.steps[0].difficultyPreparation],
        bestSeason: [this.steps[0].bestSeason],
        rating: [0],

        recipeTitle: [this.steps[1].recipeTitle],
        recipeSubtitles: [this.steps[1].recipeSubtitles],
        descriptionRecipe: [this.steps[1].descriptionRecipe],
        mainImage: [this.steps[1].mainImage],
        focusKeyword: [this.steps[1].focusKeyword],
        keywords: [this.steps[1].keywords],

        numberServings: [this.steps[2].numberServings],
        ingredients: [this.steps[2].ingredients],

        instructions: [this.steps[3].instructions],
      });
      console.log(this.recipesForm.value);

    }
    if (this.edit_status) {
      this.recipesService
        .editrecipes(this.recipesForm.value, this.recipeID as string)
        .then(() => {
          this.getRecipes();
          this.uploadPercent = 0;
        });
    } else {

      console.log(this.recipesForm.value);

      this.recipesService.addRecipess(this.recipesForm.value).then(() => {
        this.getRecipes();
        this.uploadPercent = 0;
      });

    }
    this.recipesForm.reset();
    this.edit_status = false;
    this.recipes_form = false;
    this.formStep = 1
    localStorage.removeItem('steps');
  }

}
