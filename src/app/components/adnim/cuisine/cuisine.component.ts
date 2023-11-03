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
import { СuisineResponse } from 'src/app/shared/interfaces/cuisine';
import { CuisineService } from 'src/app/shared/service/cuisine/cuisine.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-cuisine',
  templateUrl: './cuisine.component.html',
  styleUrls: ['./cuisine.component.scss']
})
export class CuisineComponent {
  public active_form = false;
  public cuisine: Array<СuisineResponse> = [];
  public cuisineForm!: FormGroup;
  public cuisine_edit_status = false;
  public cuisineID!: number | string;
  public uploadPercent!: number;

  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private cuisineService: CuisineService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.initCuisineForm();
    this.getCuisine();
  }


  // Ініціалізація форми для страв
  initCuisineForm(): void {
    this.cuisineForm = this.formBuild.group({
      cuisineName: [null, Validators.required],
      cuisineLink: [null, Validators.required],
      image: [null],
    });
  }

  // Отримання даних з сервера
  getCuisine(): void {
    this.cuisineService.getAll().subscribe((data) => {
      this.cuisine = data as СuisineResponse[];
    });
  }


  // Додавання або редагування меню
  creatCuisine() {
    if (this.cuisine_edit_status) {
      this.cuisineService
        .editCuisine(this.cuisineForm.value, this.cuisineID as string)
        .then(() => {
          this.getCuisine();
        });
    } else {
      this.cuisineService.addCuisine(this.cuisineForm.value).then(() => {
        this.getCuisine();
      });
    }
    this.cuisine_edit_status = false;
    this.active_form = false;
    this.cuisineForm.reset();
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // Редагування меню
  editDishes(cuisine: СuisineResponse) {
    this.cuisineForm.patchValue({
      cuisineName: cuisine.cuisineName,
      cuisineLink: cuisine.cuisineLink,
      cuisineImages: cuisine.image,
    });
    this.active_form = true;
    this.cuisine_edit_status = true;
    this.cuisineID = cuisine.id;
  }


  // Видалення пункту меню
  delDishes(index: СuisineResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.cuisineService.delCuisine(index.id as string).then(() => {
      this.getCuisine();
    });
  }

  // Завантаження зображення
  uploadDishesImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('cuisine-icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.cuisineForm.patchValue({
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
      this.cuisineForm.patchValue({
        image: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlDishes(control: string): string {
    return this.cuisineForm.get(control)?.value;
  }



  onCuisineNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.cuisineForm.patchValue({
      cuisineLink: transcribedValue
    });
  }

  transcribeToTranslit(input: string): string {
    const transliteration = require('transliteration.cyr');
    let transliteratedValue = transliteration.transliterate(input);
    transliteratedValue = transliteratedValue.replace(/\s+/g, '_');
    return transliteratedValue;

  }

}


