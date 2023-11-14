import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { ProductsResponse } from 'src/app/shared/interfaces/products';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';
import { ProductsService } from 'src/app/shared/service/products/products.service';
import { AddProductComponent } from '../recipe-elements/add-product/add-product.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AddUnitsComponent } from '../recipe-elements/add-units/add-units.component';
import { UnitsService } from 'src/app/shared/service/units/units.service';
import { UnitResponse } from 'src/app/shared/interfaces/units';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit {
  public ingredients: any[] = [];
  public productsCategories: any[] = [];
  public products: any[] = [];
  public units: any[] = [];
  public filteredProducts: any[] = [];
  public toppings = new FormControl('');
  public numberServings = 1;
  public group: any = {};

  constructor(
    private formBuild: FormBuilder,
    private productCategoruService: ProductCategoryService,
    private productsService: ProductsService,
    private unitService: UnitsService,
    public dialogRef: MatDialogRef<IngredientComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; ingredients: any; numberServings: any }
  ) { }

  ngOnInit(): void {
    this.getProductCategories();
    this.getProducts();
    this.getUnits();
    this.addGroup();
    if (this.data.action === 'edit') {
      this.ingredients = this.data.ingredients;
      this.numberServings = this.data.numberServings;

      const selectedProductFromData = this.data.ingredients[0]?.group[0]?.selectedProduct;

      if (selectedProductFromData) {
        const selectedProduct = this.filteredProducts.find(product => product.productsName === selectedProductFromData.productsName);

        if (selectedProduct) {
          this.ingredients[0].group[0].selectedProduct = selectedProduct;
        }
      }
    }
  }

  // Отримання категорії з сервера
  getProductCategories(): void {
    this.productCategoruService.getAll().subscribe((data) => {
      this.productsCategories = data as ProductCategoryResponse[];
    });
  }

  // Отримання продуктів з сервера
  getProducts(): void {
    this.productsService.getAll().subscribe((data) => {
      this.products = data as ProductsResponse[];
      this.onCategorySelectionChange();
    });
  }

  onCategorySelectionChange(): void {
    const selectedCategories = this.toppings.value;
    if (selectedCategories && selectedCategories.length > 0) {
      this.filteredProducts = this.products.filter(product =>
        selectedCategories.includes(product.productsCategory.productCategoryLink)
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  addGroup(): void {
    this.ingredients.push({ name: '', group: [] });
  }

  addIngredient(index: number): void {
    const newIngredient = {
      selectedProduct: null,
      amount: 0,
      unitsMeasure: '',
      notes: ''
    };

    this.ingredients[index].group.push(newIngredient);
  }

  // Отримання одинці з сервера
  getUnits(): void {
    this.unitService.getAll().subscribe((data) => {
      this.units = data as UnitResponse[];
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  delGroup(index: number): void {
    this.ingredients.splice(index, 1);
  }

  delIng(i: number, j: number): void {
    this.ingredients[i].group.splice(j, 1);
  }

  save(): void {
    this.dialogRef.close({
      ingredients: this.ingredients,
      numberServings: this.numberServings
    });
  }

  creatUnit(action: string): void {
    const dialogRef = this.dialog.open(AddUnitsComponent, {
      panelClass: 'add_units',
      data: { action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUnits();
    });
  }
  creatIng(action: string): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      panelClass: 'creat_ingredient_modal',
      data: { action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductCategories();
      this.getProducts();
    });
  }

  // Додайте метод для фільтрації продуктів
  getFilteredProducts(group: any): any[] {
    const filterValue = group.selectedProduct?.toLowerCase() || '';
    return this.filteredProducts.filter(product => product.productsName.toLowerCase().includes(filterValue));
  }


  getFilteredUnits(): any[] {
    const filterValue = this.group.unitsMeasure?.toLowerCase() || '';
    return this.units.filter(unit => unit.unitName.toLowerCase().includes(filterValue));
  }

}
