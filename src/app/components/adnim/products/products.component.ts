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
import { ProductsResponse } from 'src/app/shared/interfaces/products';
import { ViewportScroller } from '@angular/common';


const LIST: any[] = [

  { name: 'Овочі', link: 'vegetables' },
  { name: 'Фрукти', link: 'fruits' },
  { name: `М'ясо`, link: 'meat' },
  { name: 'Риба і морепродукти', link: 'fish-and-seafood' },
  { name: 'Злаки і бобові', link: 'cereals-and-legumes' },
  { name: 'Молочні продукти', link: 'dairy-products' },
  { name: 'Бакалія', link: 'groceries' },
  { name: 'Спеції і приправи', link: 'spices-and-seasonings' },
];


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  public productsCategories: any[] = LIST;
  public active_form = false;
  public toppings = new FormControl('');
  public filteredProducts: any[] = [];
  public products: any[] = [];
  public productsForm!: FormGroup;
  public uploadPercent!: number;
  public productses_edit_status = false;
  private productsID!: number | string;
  public currentSortOrder: string = 'asc';



  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private productsService: ProductsService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.initpPoductsForm();
    this.getProducts();

  }

  // Ініціалізація форми категорій
  initpPoductsForm(): void {
    this.productsForm = this.formBuild.group({
      productsCategory: [null, Validators.required],
      productsName: [null, Validators.required],
      productsLink: [null, Validators.required],
      productsCalories: [0],
      productsImages: [null],
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

  // Видалення категорію
  delProducts(index: ProductsResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.productsService.delProducts(index.id as string).then(() => {
      this.getProducts();
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




