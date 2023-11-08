import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ProductsService } from 'src/app/shared/service/products/products.service';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';
import { ProductsResponse } from 'src/app/shared/interfaces/products';
import { ViewportScroller } from '@angular/common';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  public productsCategories: any[] = [];
  public active_form = false;
  public toppings = new FormControl('');
  public filteredProducts: any[] = [];
  public products: any[] = [];
  public productsForm!: FormGroup;
  public productsCategoryForm!: FormGroup;
  public uploadPercent!: number;
  public productses_edit_status = false;
  private productsID!: number | string;
  public currentSortOrder: string = 'asc';
  public active_block = false
  public activeSection = 'category';


  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private productsService: ProductsService,
    private productCategoruService: ProductCategoryService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.initpCategoryForm();
    this.initpPoductsForm();
    this.getProductCategories();
    this.getProducts();

  }

  // Ініціалізація форми категорій
  initpCategoryForm(): void {
    this.productsCategoryForm = this.formBuild.group({
      productCategoryName: [null, Validators.required],
      productCategoryLink: [null, Validators.required],
    });
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
      this.onCategorySelectionChange()
    });
  }

  onCategorySelectionChange() {
    const selectedCategories = this.toppings.value
    if (selectedCategories) {
      this.filteredProducts = this.products.filter(product =>
        selectedCategories.includes(product.productsCategory.link)
      );
    } else {
      this.filteredProducts = this.products
    }

  }

  // Обробник вибору пункту меню
  onSelectItem(item: string): void {
    this.activeSection = item;
  }


  // Завантаження зображення для меню
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

  // Редагування категорію
  editProducts(products: ProductsResponse) {
    this.productsForm.patchValue({
      productsCategory: products.productsCategory,
      productsName: products.productsName,
      productsLink: products.productsLink,
      productsCalories: products.productsCalories,
      image: products.image,
    });
    this.active_form = true;
    this.productses_edit_status = true;
    this.productsID = products.id;
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

  // Видалення категорію
  delProducts(index: ProductsResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.productsService.delProducts(index.id as string).then(() => {
      this.getProducts();
    });
  }

  // Видалення категорію
  delCategory(index: ProductCategoryResponse) {
    this.productCategoruService.delProductCategory(index.id as string).then(() => {
      this.getProductCategories();
    });
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
    this.productses_edit_status = false;
    this.active_form = false;
    this.productsForm.reset();
    this.viewportScroller.scrollToPosition([0, 0]);
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
    this.productses_edit_status = false;
    this.active_form = false;
    this.productsForm.reset();
    this.viewportScroller.scrollToPosition([0, 0]);
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





}




