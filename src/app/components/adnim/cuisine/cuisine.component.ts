import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { СuisineResponse } from 'src/app/shared/interfaces/cuisine';
import { CuisineService } from 'src/app/shared/service/cuisine/cuisine.service';
import { ViewportScroller } from '@angular/common';
import { AddCuisineComponent } from 'src/app/modal/recipe-elements/add-cuisine/add-cuisine.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cuisine',
  templateUrl: './cuisine.component.html',
  styleUrls: ['./cuisine.component.scss']
})
export class CuisineComponent {
  public cuisine: Array<СuisineResponse> = [];
  delete: any;


  constructor(
    private storsgeIcon: Storage,
    private cuisineService: CuisineService,
    private viewportScroller: ViewportScroller,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCuisine();
  }


  // Отримання даних з сервера
  getCuisine(): void {
    this.cuisineService.getAll().subscribe((data) => {
      this.cuisine = data as СuisineResponse[];
    });
  }



  // Видалення пункту меню
  delCuisine(index: СuisineResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.cuisineService.delCuisine(index.id as string).then(() => {
      this.getCuisine();
    });
  }



  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddCuisineComponent, {
      panelClass: 'cuisine_modal_dialog',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCuisine();
    });



  }


}


