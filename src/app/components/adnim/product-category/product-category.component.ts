import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductCatgoriesComponent } from 'src/app/modal/recipe-elements/add-product-catgories/add-product-catgories.component';
import { ProductCategoryResponse } from 'src/app/shared/interfaces/productCategory';
import { ProductCategoryService } from 'src/app/shared/service/productCategory/product-category.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent {
  public productsCategories: any[] = [];
  public productsCategoryForm!: FormGroup;
  public active_form = false;
  public productses_edit_status = false;
  private productsID!: number | string;

  constructor(
    private productCategoruService: ProductCategoryService,
    private formBuild: FormBuilder,
    private viewportScroller: ViewportScroller,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProductCategories();
  }

  // Отримання категорії з сервера
  getProductCategories(): void {
    this.productCategoruService.getAll().subscribe((data) => {
      this.productsCategories = data as ProductCategoryResponse[];
    });
  }

  // Видалення категорію
  delCategory(index: ProductCategoryResponse) {
    this.productCategoruService.delProductCategory(index.id as string).then(() => {
      this.getProductCategories();
    });
  }



  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddProductCatgoriesComponent, {
      panelClass: 'productCatgories_modal_dialog',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProductCategories();
    });

  }



}
