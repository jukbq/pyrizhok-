import { Component } from '@angular/core';
import {
  deleteObject,
  ref,
  Storage,
} from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { AddUnitsComponent } from 'src/app/modal/recipe-elements/add-units/add-units.component';
import { UnitResponse } from 'src/app/shared/interfaces/units';
import { UnitsService } from 'src/app/shared/service/units/units.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent {
  public units: Array<UnitResponse> = [];
  public units_edit_status = false;

  constructor(
    public dialog: MatDialog,
    private unitsService: UnitsService,
  ) { }


  ngOnInit(): void {
    this.getUnits();
  }

  // Отримання даних з сервера
  getUnits(): void {
    this.unitsService.getAll().subscribe((data) => {
      this.units = data as UnitResponse[];
    });
  }



  // Видалення пункту меню
  delUnits(index: UnitResponse) {
    this.unitsService.delUnits(index.id as string).then(() => {
      this.getUnits();
    });
  }


  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddUnitsComponent, {
      panelClass: 'add_units',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUnits();
    });



  }
}



