import { ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';


@Component({
  selector: 'app-add-method-cooking',
  templateUrl: './add-method-cooking.component.html',
  styleUrls: ['./add-method-cooking.component.scss']
})
export class AddMethodCookingComponent {
  public methodCookingForm!: FormGroup;
  public metod_edit_status = false;
  private metodID!: number | string;
  public metod: Array<MethodCookinResponse> = [];

  constructor(
    public dialogRef: MatDialogRef<AddMethodCookingComponent>,
    private formBuild: FormBuilder,
    private metodCokingService: MethodCookinService,
    private viewportScroller: ViewportScroller,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
  ) { }

  ngOnInit(): void {
    this.initCategoriesDishesForm();
    this.getMetod();
    if (this.data.action === 'edit') {
      this.editCategoriesDishes(this.data.object)
    }
  }

  // Ініціалізація форми категорій
  initCategoriesDishesForm(): void {
    this.methodCookingForm = this.formBuild.group({
      methodCookinName: [null, Validators.required],
      methodCookinLink: [null, Validators.required],

    });
  }

  // Отримання страв  з сервера
  getMetod(): void {
    this.metodCokingService.getAll().subscribe((data) => {
      this.metod = data as MethodCookinResponse[];
    });
  }

  // Редагування категорію
  editCategoriesDishes(metod: MethodCookinResponse) {
    this.methodCookingForm.patchValue({
      methodCookinName: metod.methodCookinName,
      methodCookinLink: metod.methodCookinLink,

    });

    this.metod_edit_status = true;
    this.metodID = metod.id;
  }

  // Додавання або редагування меню
  creatCategories() {
    if (this.metod_edit_status) {
      this.metodCokingService
        .editMethodCookin(this.methodCookingForm.value, this.metodID as string)
        .then(() => {
          this.getMetod();
        });
    } else {
      this.metodCokingService.addMethodCookin(this.methodCookingForm.value).then(() => {
        this.getMetod();
      });
    }
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }

  onCategoriesNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.methodCookingForm.patchValue({
      methodCookinLink: transcribedValue
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
