import { Component } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import {
  deleteObject,
  ref,
  Storage,
} from '@angular/fire/storage';
import { CategoriesDishesResponse } from 'src/app/shared/interfaces/categories -dishes';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { CategoriesDishesService } from 'src/app/shared/service/categories-dishes/categories-dishes.service';
import { ViewportScroller } from '@angular/common';
import { AddCategoriesDishesComponent } from 'src/app/modal/recipe-elements/add-categories-dishes/add-categories-dishes.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-dishes',
  templateUrl: './categories-dishes.component.html',
  styleUrls: ['./categories-dishes.component.scss']
})
export class CategoriesDishesComponent {
  public dishes: Array<DishesResponse> = [];
  public categoriesDishes: Array<CategoriesDishesResponse> = [];

  constructor(
    private storsgeIcon: Storage,
    private dishesService: DishesService,
    private categoriesDishesService: CategoriesDishesService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getDishes();
    this.getCategories();
  }



  // Отримання страв  з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }

  // Отримання категорій  з сервера
  getCategories(): void {
    this.categoriesDishesService.getAll().subscribe((data) => {
      this.categoriesDishes = data as CategoriesDishesResponse[];
    });
  }


  // Видалення категорію
  delCategori(index: CategoriesDishesResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.categoriesDishesService.delCategories(index.id as string).then(() => {
      this.getDishes();
    });
  }



  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddCategoriesDishesComponent, {
      panelClass: 'сategoriesDishes_modal_dialog',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDishes()
      this.getCategories();
    });



  }
}
