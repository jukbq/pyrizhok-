import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-categories-dishes',
  templateUrl: './categories-dishes.component.html',
  styleUrls: ['./categories-dishes.component.scss']
})
export class CategoriesDishesComponent {
  public active_form = false;
  public dishes: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public categoriesDishesForm!: FormGroup;
  public uploadPercent!: number;
  public categories_edit_status = false;
  private categoriesID!: number | string;

  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private dishesService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.initCategoriesDishesForm();
    this.getDishes();
    this.getCategories();
  }


  // Ініціалізація форми категорій
  initCategoriesDishesForm(): void {
    this.categoriesDishesForm = this.formBuild.group({
      dishes: [null, Validators.required],
      categoryIndex: [null, Validators.required],
      categoryName: [null, Validators.required],
      categoryLink: [null, Validators.required],
      categoryImage: [null, Validators.required],
    });
  }

  // Отримання страв  з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }

  // Отримання категорій  з сервера
  getCategories(): void {
    this.categoriesDishesService.getAll().subscribe((data) => {
      this.categoriesDishes = data as CategoriesDishesResponse[];
    });
  }

  // Завантаження зображення для меню
  uploadDishesImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('categoriesDishes-icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.categoriesDishesForm.patchValue({
            categoryImage: data,
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
    const task = ref(this.storsgeIcon, this.valueByControlDishes('dishesImages'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.categoriesDishesForm.patchValue({
        dishesImages: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlDishes(control: string): string {
    return this.categoriesDishesForm.get(control)?.value;
  }

  // Редагування категорію
  editDishes(categori: CategoriesDishesResponse) {
    this.categoriesDishesForm.patchValue({
      dishes: categori.dishes,
      categoryIndex: categori.categoryIndex,
      categoryName: categori.categoryName,
      categoryLink: categori.categoryLink,
      categoryImage: categori.categoryImage,
    });
    this.active_form = true;
    this.categories_edit_status = true;
    this.categoriesID = categori.id;
  }

  // Видалення категорію
  delCategori(index: CategoriesDishesResponse) {
    const task = ref(this.storsgeIcon, index.categoryImage);
    deleteObject(task);
    this.categoriesDishesService.delCategories(index.id as string).then(() => {
      this.getDishes();
    });
  }


  // Додавання або редагування меню
  creatCategories() {
    if (this.categories_edit_status) {
      this.categoriesDishesService
        .editCategories(this.categoriesDishesForm.value, this.categoriesID as string)
        .then(() => {
          this.getDishes();
        });
    } else {
      this.categoriesDishesService.addCategories(this.categoriesDishesForm.value).then(() => {
        this.getDishes();
      });
    }
    this.categories_edit_status = false;
    this.active_form = false;
    this.categoriesDishesForm.reset();
    this.viewportScroller.scrollToPosition([0, 0]);
  }


  onCategoriesNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.categoriesDishesForm.patchValue({
      categoryLink: transcribedValue
    });
  }

  transcribeToTranslit(input: string): string {
    const transliteration = require('transliteration.cyr');
    let transliteratedValue = transliteration.transliterate(input);
    transliteratedValue = transliteratedValue.replace(/\s+/g, '_');
    return transliteratedValue;
  }
}
