import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-add-categories-dishes',
  templateUrl: './add-categories-dishes.component.html',
  styleUrls: ['./add-categories-dishes.component.scss']
})
export class AddCategoriesDishesComponent {
  public dishes: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];
  public categoriesDishesForm!: FormGroup;
  public uploadPercent!: number;
  public categories_edit_status = false;
  private categoriesID!: number | string;

  constructor(
    private formBuild: FormBuilder,
    public dialogRef: MatDialogRef<AddCategoriesDishesComponent>,
    private storsgeIcon: Storage,
    private dishesService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
    private viewportScroller: ViewportScroller
  ) { }


  ngOnInit(): void {
    this.initCategoriesDishesForm();
    this.getDishes();
    this.getCategories();
    if (this.data.action === 'edit') {
      this.editCategoriesDishes(this.data.object)
    }

  }


  // Ініціалізація форми категорій
  initCategoriesDishesForm(): void {
    this.categoriesDishesForm = this.formBuild.group({
      dishes: [null, Validators.required],
      categoryIndex: [null, Validators.required],
      categoryName: [null, Validators.required],
      categoryLink: [null, Validators.required],
      image: [null, Validators.required],
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
      this.categoriesDishesForm.patchValue({
        image: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlDishes(control: string): string {
    return this.categoriesDishesForm.get(control)?.value;
  }


  // Редагування категорію
  editCategoriesDishes(categori: CategoriesDishesResponse) {
    this.categoriesDishesForm.patchValue({
      dishes: categori.dishes,
      categoryIndex: categori.categoryIndex,
      categoryName: categori.categoryName,
      categoryLink: categori.categoryLink,
      image: categori.image,
    });

    this.categories_edit_status = true;
    this.categoriesID = categori.id;
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
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
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
  close(): void {
    this.dialogRef.close();
  }
}
