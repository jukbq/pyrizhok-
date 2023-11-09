import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { ProductsResponse } from 'src/app/shared/interfaces/products';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';
import { ProductsService } from 'src/app/shared/service/products/products.service';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent {
  public ingredients: any[] = [];
  public productsCategories: any[] = [];
  public products: any[] = [];
  public toppings = new FormControl('');
  public filteredProducts: any[] = [];
  public ingForm!: FormGroup;


  constructor(
    private formBuild: FormBuilder,
    private productCategoruService: ProductCategoryService,
    private productsService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.initIngForm();
    this.getProductCategories();
    this.getProducts();
    this.addGroup();
  }

  initIngForm(): void {
    this.ingForm = this.formBuild.group({
      nameIngGroup: [null, Validators.required],
      productsCategory: [null, Validators.required],
      ingredients: [null, Validators.required],
      amountProdukt: [null, Validators.required],
      unitsMeasure: [null, Validators.required],
      notes: [null],
    })
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
    console.log(selectedCategories);

    if (selectedCategories && selectedCategories.length > 0) {
      this.filteredProducts = this.products.filter(product =>
        selectedCategories.includes(product.productsCategory.productCategoryLink)
      );
    } else {

      this.filteredProducts = this.products;
    }


  }




  addGroup(): void {
    const newIngredientGroup = {
      name: '',
      group: [
        {
          productsCategory: '',
          ingredients: '',
          amountProdukt: 0,
          unitsMeasure: '',
          notes: ''
        }
      ],
      ingForm: this.formBuild.group({
        nameIngGroup: [null, Validators.required],
        productsCategory: [null, Validators.required],
        ingredients: [null, Validators.required],
        amountProdukt: [null, Validators.required],
        unitsMeasure: [null, Validators.required],
        notes: [null],
      })
    };
    this.ingredients.push(newIngredientGroup);
  }


  addIngredient(index: number): void {
    this.ingredients[index].group.push({
      productsCategory: '',
      ingredients: '',
      amountProdukt: 0,
      unitsMeasure: '',
      notes: ''
    });
  }

}