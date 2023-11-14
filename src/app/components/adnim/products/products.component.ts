import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  deleteObject,
  ref,
  Storage,

} from '@angular/fire/storage';
import { ProductsService } from 'src/app/shared/service/products/products.service';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';
import { ProductsResponse } from 'src/app/shared/interfaces/products';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { AddProductComponent } from 'src/app/modal/recipe-elements/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';

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
  public currentSortOrder: string = 'asc';
  public activeSection = 'category';


  constructor(
    private storsgeIcon: Storage,
    private productsService: ProductsService,
    private productCategoruService: ProductCategoryService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProductCategories();
    this.getProducts();

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

    if (selectedCategories && selectedCategories.length > 0) {
      this.filteredProducts = this.products.filter(product =>
        selectedCategories.includes(product.productsCategory.productCategoryLink)
      );
    } else {

      this.filteredProducts = this.products;
    }


  }

  // Обробник вибору пункту меню
  onSelectItem(item: string): void {
    this.activeSection = item;
  }

  // Видалення категорію
  delProducts(index: ProductsResponse) {
    const task = ref(this.storsgeIcon, index.productsImages);
    deleteObject(task);
    this.productsService.delProducts(index.id as string).then(() => {
      this.getProducts();
    });
  }

  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      panelClass: 'pproducts_modal_dialog',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProducts();
    });

  }


}




