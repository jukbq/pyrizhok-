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

import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent {
  public active_form = false;
  public dishes: Array<DishesResponse> = [];
  public dishes_edit_status = false;
  public dishesForm!: FormGroup;
  private dishesID!: number | string;
  public uploadPercent!: number;


  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private dishesService: DishesService,

  ) { }

  ngOnInit(): void {
    this.initDishesForm();
    this.getDishes();
  }


  // Ініціалізація форми для страв
  initDishesForm(): void {
    this.dishesForm = this.formBuild.group({
      dishesindex: [null, Validators.required],
      dishesName: [null, Validators.required],
      dishesLink: [null, Validators.required],
      dishesImages: [null, Validators.required],
    });
  }

  // Отримання даних з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }


  // Додавання або редагування меню
  creatDishes() {
    if (this.dishes_edit_status) {
      this.dishesService
        .editdishes(this.dishesForm.value, this.dishesID as string)
        .then(() => {
          this.getDishes();
        });
    } else {
      this.dishesService.addDishes(this.dishesForm.value).then(() => {
        this.getDishes();
      });
    }
    this.dishes_edit_status = false;
    this.active_form = false;
    this.dishesForm.reset();
  }

  // Редагування меню
  editDishes(dishes: DishesResponse) {
    this.dishesForm.patchValue({
      dishesindex: dishes.dishesindex,
      dishesName: dishes.dishesName,
      dishesLink: dishes.dishesLink,
      dishesImages: dishes.dishesImages,
    });
    this.active_form = true;
    this.dishes_edit_status = true;
    this.dishesID = dishes.id;
  }

  // Видалення пункту меню
  delDishes(index: DishesResponse) {
    const task = ref(this.storsgeIcon, index.dishesImages);
    deleteObject(task);
    this.dishesService.delDishes(index.id as string).then(() => {
      this.getDishes();
    });
  }

  // Завантаження зображення для меню
  uploadDishesImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('dishes-icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.dishesForm.patchValue({
            dishesImages: data,
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
      this.dishesForm.patchValue({
        dishesImages: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlDishes(control: string): string {
    return this.dishesForm.get(control)?.value;
  }

}
