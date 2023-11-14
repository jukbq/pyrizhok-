import { Component } from '@angular/core';
import {
  deleteObject,
  ref,
  Storage,
} from '@angular/fire/storage';

import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDishesComponent } from 'src/app/modal/recipe-elements/add-dishes/add-dishes.component';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent {
  public dishes: Array<DishesResponse> = [];
  public dishes_edit_status = false;
  public uploadPercent!: number;


  constructor(
    public dialog: MatDialog,
    private storsgeIcon: Storage,
    private dishesService: DishesService,
  ) { }

  ngOnInit(): void {
    this.getDishes();
  }


  // Отримання даних з сервера
  getDishes(): void {
    this.dishesService.getAll().subscribe((data) => {
      this.dishes = data as DishesResponse[];
    });
  }



  // Видалення пункту меню
  delDishes(index: DishesResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.dishesService.delDishes(index.id as string).then(() => {
      this.getDishes();
    });
  }


  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddDishesComponent, {
      panelClass: 'add_dishes',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDishes();
    });



  }

}
