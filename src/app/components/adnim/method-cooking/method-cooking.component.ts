import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMethodCookingComponent } from 'src/app/modal/recipe-elements/add-method-cooking/add-method-cooking.component';
import { MethodCookinResponse } from 'src/app/shared/interfaces/method-cooking';
import { MethodCookinService } from 'src/app/shared/service/method-cookin/method-cookin.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';


@Component({
  selector: 'app-method-cooking',
  templateUrl: './method-cooking.component.html',
  styleUrls: ['./method-cooking.component.scss']
})
export class MethodCookingComponent {
  public metod: Array<MethodCookinResponse> = [];


  constructor(
    public dialog: MatDialog,
    private metodCokingService: MethodCookinService,
    private viewportScroller: ViewportScroller,

  ) { }


  ngOnInit(): void {
    this.getMetod();
  }






  // Отримання страв  з сервера
  getMetod(): void {
    this.metodCokingService.getAll().subscribe((data) => {
      this.metod = data as MethodCookinResponse[];
    });
  }


  // Видалення пункту меню
  delMetod(index: MethodCookinResponse) {
    this.metodCokingService.delmethodCookin(index.id as string).then(() => {
      this.getMetod();
    });
  }

  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddMethodCookingComponent, {
      panelClass: 'cuisine_modal_dialog',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getMetod();
    });

  }

}
