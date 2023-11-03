import { ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { СuisineResponse } from 'src/app/shared/interfaces/cuisine';
import { CuisineService } from 'src/app/shared/service/cuisine/cuisine.service';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';

@Component({
  selector: 'app-recipe-elements',
  templateUrl: './recipe-elements.component.html',
  styleUrls: ['./recipe-elements.component.scss']
})
export class RecipeElementsComponent {
  public component = '';
  public uploadPercent!: number;

  //фОРМИ
  public dishesForm!: FormGroup;
  public categoriesDishesForm!: FormGroup;
  public cuisineForm!: FormGroup;
  public methodCookingForm!: FormGroup;
  public toolsForm!: FormGroup;

  //МАСИВИ ДАНИХ
  public dishes: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public cuisine: Array<СuisineResponse> = [];
  public methodCooking: Array<MethodCookinResponse> = [];
  public tools: Array<ToolsResponse> = [];


  constructor(
    private formBuild: FormBuilder,
    public dialogRef: MatDialogRef<RecipeElementsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: string; },
    private categoriesDishesService: CategoriesDishesService,
    private viewportScroller: ViewportScroller,
    private dishesService: DishesService,
    private storsgeIcon: Storage,
    private cuisineService: CuisineService,
    private methodCookingService: MethodCookinService,
    private toolsService: ToolsService,
  ) { }

  ngOnInit(): void {
    this.component = this.data.action
    console.log(this.component);
    if (this.component === 'dishes' || this.component === 'categoriesDishes') {
      this.initDishesForm();
      this.initCategoriesDishesForm();
      this.getDishes();
      this.getCategories();
      console.log(this.component);
    }
    if (this.component === 'cuisine') {
      this.initCuisineForm();
      console.log(this.component);
    }



  }
  //СТРАВИ
  // Отримання страв  з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }

  // Ініціалізація форми для страв
  initDishesForm(): void {
    this.dishesForm = this.formBuild.group({
      dishesindex: [null, Validators.required],
      dishesName: [null, Validators.required],
      dishesLink: [null, Validators.required],
      Image: [null, Validators.required],
    });
  }

  // Додавання основної страви
  creatDishes() {
    this.dishesService.addDishes(this.dishesForm.value).then(() => {
      this.getDishes();
    });
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0]);
  }


  //КАТЕГОРІЇ СТРАВ
  // Отримання категорій  з сервера
  getCategories(): void {
    this.categoriesDishesService.getAll().subscribe((data) => {
      this.categoriesDishes = data as CategoriesDishesResponse[];
    });
  }

  //Ініціалізація форми категорій
  initCategoriesDishesForm(): void {
    this.categoriesDishesForm = this.formBuild.group({
      dishes: [null, Validators.required],
      categoryIndex: [null, Validators.required],
      categoryName: [null, Validators.required],
      categoryLink: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  // Додавання категорыъ страв
  creatCategories() {
    this.categoriesDishesService.addCategories(this.categoriesDishesForm.value).then(() => {
      this.getDishes();
    });
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0]);
  }


  //КУХНІ
  initCuisineForm(): void {
    this.cuisineForm = this.formBuild.group({
      cuisineName: [null, Validators.required],
      cuisineLink: [null, Validators.required],
      image: [null],
    });
  }

  creatCuisine() {
    this.cuisineService.addCuisine(this.cuisineForm.value).then(() => {
    });

    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0]);
  }



  //МЕТОДИ ПРОИГОТУВАННЯ
  initMethodCooking(): void {
    this.methodCookingForm = this.formBuild.group({
      methodCookinName: [null, Validators.required],
      methodCookinLink: [null, Validators.required],
      image: [null],
    });
  }
  creatMethodCooking() {
    this.methodCookingService.addMethodCookin(this.cuisineForm.value).then(() => {
    });
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  //ІНСТРУМЕНТИ
  getTools(): void {
    this.toolsService.getAll().subscribe((data) => {
      this.tools = data as ToolsResponse[];
    });
  }

  initToolsForm(): void {
    this.toolsForm = this.formBuild.group({
      toolsName: [null, Validators.required],
      toolsLink: [null, Validators.required],
      image: [null],
    });
  }

  creatToolse() {
    this.toolsService.addTools(this.cuisineForm.value).then(() => {
    });

    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0]);
  }









  //ЗОБРАЖЕННЯ
  // Завантаження зображення для меню
  uploadDishesImage(actionImage: any): void {
    let component = this.component
    const file = actionImage.target.files[0];
    this.loadFIle(`${component}-icon`, file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.dishesForm.patchValue({
            image: data,
          });

        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Завантаження файлу в хмарне сховище
  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const pathIcon = `${folder}/${name}`;
    let urlIcon = '';
    if (file) {
      try {
        const storageRef = ref(this.storsgeIcon, pathIcon);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        urlIcon = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wrong file');
    }
    return Promise.resolve(urlIcon);
  }

  // Видалення зображення
  deleteImage(): void {
    const task = ref(this.storsgeIcon, this.valueByControlDishes('image'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.dishesForm.patchValue({
        image: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlDishes(control: string) {
    if (this.component === 'dishes') {
      return this.dishesForm.get(control)?.value;
    }
    if (this.component === 'categoriesDishes') {
      return this.categoriesDishesForm.get(control)?.value;
    }
    if (this.component === 'cuisine') {
      return this.cuisineForm.get(control)?.value;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
