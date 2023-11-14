import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ProductsService } from 'src/app/shared/service/products/products.service';
import { ViewportScroller } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsResponse } from 'src/app/shared/interfaces/products';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  public products: any[] = [];
  public productsForm!: FormGroup;
  public productsCategories: any[] = [];
  public uploadPercent!: number;
  public productses_edit_status = false;
  private productsID!: number | string;

  constructor(
    private productCategoruService: ProductCategoryService,
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private productsService: ProductsService,
    private viewportScroller: ViewportScroller,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
  ) { }

  ngOnInit(): void {
    this.initpPoductsForm();
    this.getProductCategories();
    this.getProducts();
    if (this.data.action === 'edit') {
      this.editProducts(this.data.object)
    }
  }


  // Ініціалізація форми продуктів
  initpPoductsForm(): void {
    this.productsForm = this.formBuild.group({
      productsCategory: [null, Validators.required],
      productsName: [null, Validators.required],
      productsLink: [null, Validators.required],
      productsCalories: [0],
      productsImages: [null],
    });
  }


  // Отримання категорії з сервера
  getProductCategories(): void {
    this.productCategoruService.getAll().subscribe((data) => {
      this.productsCategories = data as ProductCategoryResponse[];
    });
  }

  // Отримання продукти з сервера
  getProducts(): void {
    this.productsService.getAll().subscribe((data) => {
      this.products = data as ProductsResponse[];

    });
  }

  // Редагування категорію
  editProducts(products: ProductsResponse) {
    this.productsForm.patchValue({
      productsCategory: products.productsCategory,
      productsName: products.productsName,
      productsLink: products.productsLink,
      productsCalories: products.productsCalories,
      productsImages: products.productsImages,
    });
    this.productses_edit_status = true;
    this.productsID = products.id;
  }


  // Додавання або редагування продукта
  creatProducts() {
    if (this.productses_edit_status) {
      this.productsService
        .editproducts(this.productsForm.value, this.productsID as string)
        .then(() => {
          this.getProducts();
        });
    } else {
      this.productsService.addProducts(this.productsForm.value).then(() => {
        this.getProducts();
      });
    }
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }




  // Завантаження зображення для продуктів
  uploadProductsImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('products-icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.productsForm.patchValue({
            productsImages: data,
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
    const task = ref(this.storsgeIcon, this.valueByControlProducts('productsImages'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.productsForm.patchValue({
        productsImages: '',
      });
    });
  }




  // Отримання значення за назвою поля у формі меню
  valueByControlProducts(control: string): string {
    return this.productsForm.get(control)?.value;
  }

  onProductNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.productsForm.patchValue({
      productsLink: transcribedValue
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
