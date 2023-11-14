import { ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';

@Component({
  selector: 'app-add-product-catgories',
  templateUrl: './add-product-catgories.component.html',
  styleUrls: ['./add-product-catgories.component.scss']
})
export class AddProductCatgoriesComponent {
  public productsCategories: any[] = [];
  public productsCategoryForm!: FormGroup;
  public active_form = false;
  public productses_edit_status = false;
  private productsID!: number | string;

  constructor(
    public dialogRef: MatDialogRef<AddProductCatgoriesComponent>,
    private productCategoruService: ProductCategoryService,
    private formBuild: FormBuilder,
    private viewportScroller: ViewportScroller,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
  ) { }

  ngOnInit(): void {
    this.initpCategoryForm();
    this.getProductCategories();
    if (this.data.action === 'edit') {
      this.editCategory(this.data.object)
    }
  }

  // Ініціалізація форми категорій
  initpCategoryForm(): void {
    this.productsCategoryForm = this.formBuild.group({
      productCategoryName: [null, Validators.required],
      productCategoryLink: [null, Validators.required],
    });
  }

  // Отримання категорії з сервера
  getProductCategories(): void {
    this.productCategoruService.getAll().subscribe((data) => {
      this.productsCategories = data as ProductCategoryResponse[];
    });
  }

  // Редагування категорію
  editCategory(category: ProductCategoryResponse) {
    this.productsCategoryForm.patchValue({
      productCategoryName: category.productCategoryName,
      productCategoryLink: category.productCategoryLink,

    });
    this.active_form = true;
    this.productses_edit_status = true;
    this.productsID = category.id;
  }

  // Додавання або редагування продукта
  creatProductCategory() {
    if (this.productses_edit_status) {
      this.productCategoruService
        .editProductCategory(this.productsCategoryForm.value, this.productsID as string)
        .then(() => {
          this.getProductCategories();
        });
    } else {

      this.productCategoruService.addProductCategory(this.productsCategoryForm.value).then(() => {
        this.getProductCategories();
      });
    }
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }


  onProductNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.productsCategoryForm.patchValue({
      productCategoryLink: transcribedValue
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
