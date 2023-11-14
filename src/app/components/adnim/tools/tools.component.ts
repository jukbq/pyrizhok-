import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddToolsComponent } from 'src/app/modal/recipe-elements/add-tools/add-tools.component';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';
import {
  deleteObject,
  ref,
  Storage,
} from '@angular/fire/storage';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {
  public tools: Array<ToolsResponse> = [];
  public tools_edit_status = false;
  public uploadPercent!: number;


  constructor(
    public dialog: MatDialog,
    private storsgeIcon: Storage,
    private toolsService: ToolsService,
  ) { }


  ngOnInit(): void {
    this.getTools();
  }


  // Отримання даних з сервера
  getTools(): void {
    this.toolsService.getAll().subscribe((data) => {
      this.tools = data as ToolsResponse[];
    });
  }



  // Видалення пункту меню
  delTools(index: ToolsResponse) {
    const task = ref(this.storsgeIcon, index.image);
    deleteObject(task);
    this.toolsService.deltools(index.id as string).then(() => {
      this.getTools();
    });
  }


  addModal(action: string, object: any): void {
    const dialogRef = this.dialog.open(AddToolsComponent, {
      panelClass: 'add_tools',
      data: { action, object }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getTools();
    });



  }
}
