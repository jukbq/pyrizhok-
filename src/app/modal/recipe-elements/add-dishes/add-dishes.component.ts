import { ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Component({
  selector: 'app-add-dishes',
  templateUrl: './add-dishes.component.html',
  styleUrls: ['./add-dishes.component.scss']
})
export class AddDishesComponent {
  public dishesForm!: FormGroup;
  public dishes: Array<DishesResponse> = [];
  public uploadPercent!: number;
  public dishess_edit_status = false;
  private dishesID!: number | string;

  constructor(
    public dialog: MatDialog,
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private dishesService: DishesService,
    public dialogRef: MatDialogRef<AddDishesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.initDishesForm();
    this.getDishes();
    if (this.data.action === 'edit') {
      this.editDishes(this.data.object)
    }
  }


  // Ініціалізація форми для страв
  initDishesForm(): void {
    this.dishesForm = this.formBuild.group({
      dishesindex: [null, Validators.required],
      dishesName: [null, Validators.required],
      dishesLink: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  // Отримання страв  з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }

  // Редагування категорію
  editDishes(dishes: DishesResponse) {
    this.dishesForm.patchValue({
      dishesindex: dishes.dishesindex,
      dishesName: dishes.dishesName,
      dishesLink: dishes.dishesLink,
      image: dishes.image,
    });

    this.dishess_edit_status = true;
    this.dishesID = dishes.id;
  }

  // Додавання або редагування меню
  creatCategories() {
    if (this.dishess_edit_status) {
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
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }


  //ЗОБРАЖЕННЯ
  // Завантаження зображення для меню
  uploadDishesImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('dishes-icon', file.name, file)
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
  valueByControlDishes(control: string): string {
    return this.dishesForm.get(control)?.value;
  }

  onCategoriesNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.dishesForm.patchValue({
      dishesLink: transcribedValue
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
