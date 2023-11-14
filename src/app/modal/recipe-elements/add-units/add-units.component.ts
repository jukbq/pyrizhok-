import { Component, Inject } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitsService } from 'src/app/shared/service/units/units.service';
import { ViewportScroller } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnitResponse } from 'src/app/shared/interfaces/units';

@Component({
  selector: 'app-add-units',
  templateUrl: './add-units.component.html',
  styleUrls: ['./add-units.component.scss']
})
export class AddUnitsComponent {
  public units: any[] = [];
  public unitsForm!: FormGroup;
  public uploadPercent!: number;
  public unitses_edit_status = false;
  private unitsID!: number | string;


  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private unitService: UnitsService,
    private viewportScroller: ViewportScroller,
    public dialogRef: MatDialogRef<AddUnitsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
  ) { }

  ngOnInit(): void {
    this.initpUnitsForm();
    this.getUnits();
    if (this.data.action === 'edit') {
      this.editUnits(this.data.object)
    }
  }

  // Ініціалізація форми продуктів
  initpUnitsForm(): void {
    this.unitsForm = this.formBuild.group({
      unitName: [null, Validators.required],
      unitLink: [null, Validators.required],
    });
  }

  // Отримання одинці з сервера
  getUnits(): void {
    this.unitService.getAll().subscribe((data) => {
      this.units = data as UnitResponse[];
    });
  }

  // Редагування категорію
  editUnits(products: UnitResponse) {
    this.unitsForm.patchValue({
      unitName: products.unitName,
      unitLink: products.unitLink,
    });
    this.unitses_edit_status = true;
    this.unitsID = products.id;
  }


  // Додавання або редагування продукта
  creatUnits() {
    if (this.unitses_edit_status) {
      this.unitService
        .editUnits(this.unitsForm.value, this.unitsID as string)
        .then(() => {
          this.getUnits();
        });
    } else {
      this.unitService.addUnits(this.unitsForm.value).then(() => {
        this.getUnits();
      });
    }
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }

  onProductNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.unitsForm.patchValue({
      unitLink: transcribedValue
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
