import { ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolsResponse } from 'src/app/shared/interfaces/tools';
import { ToolsService } from 'src/app/shared/service/tools/tools.service';


@Component({
  selector: 'app-add-tools',
  templateUrl: './add-tools.component.html',
  styleUrls: ['./add-tools.component.scss']
})
export class AddToolsComponent {
  public tools: any[] = [];
  public toolsForm!: FormGroup;
  public uploadPercent!: number;
  public toolses_edit_status = false;
  private toolsID!: number | string;

  constructor(
    private formBuild: FormBuilder,
    private storsgeIcon: Storage,
    private toolsService: ToolsService,
    private viewportScroller: ViewportScroller,
    public dialogRef: MatDialogRef<AddToolsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; object: any; },
  ) { }

  ngOnInit(): void {
    this.initpToolsForm();
    this.getTools();
    if (this.data.action === 'edit') {
      this.editTools(this.data.object)
    }
  }

  // Ініціалізація форми продуктів
  initpToolsForm(): void {
    this.toolsForm = this.formBuild.group({
      toolsName: [null, Validators.required],
      toolsLink: [null, Validators.required],
      image: [null],
    });
  }

  // Отримання продукти з сервера
  getTools(): void {
    this.toolsService.getAll().subscribe((data) => {
      this.tools = data as ToolsResponse[];
    });
  }

  // Редагування категорію
  editTools(products: ToolsResponse) {
    this.toolsForm.patchValue({
      toolsName: products.toolsName,
      toolsLink: products.toolsLink,
      image: products.image,
    });
    this.toolses_edit_status = true;
    this.toolsID = products.id;
  }


  // Додавання або редагування продукта
  creatTools() {
    if (this.toolses_edit_status) {
      this.toolsService
        .editTools(this.toolsForm.value, this.toolsID as string)
        .then(() => {
          this.getTools();
        });
    } else {
      this.toolsService.addTools(this.toolsForm.value).then(() => {
        this.getTools();
      });
    }
    this.dialogRef.close();
    this.viewportScroller.scrollToPosition([0, 0])
  }




  // Завантаження зображення для продуктів
  uploadToolsImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('tools-icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.toolsForm.patchValue({
            image: data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Завантаження файлу в хмарне сховище
  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const pathIcon = `${folder}/${name}`;
    let urlIcon = '';
    if (file) {
      try {
        const storageRef = ref(this.storsgeIcon, pathIcon);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        urlIcon = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wrong file');
    }
    return Promise.resolve(urlIcon);
  }

  // Видалення зображення
  deleteImage(): void {
    const task = ref(this.storsgeIcon, this.valueByControlTools('productsImages'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.toolsForm.patchValue({
        image: '',
      });
    });
  }




  // Отримання значення за назвою поля у формі меню
  valueByControlTools(control: string): string {
    return this.toolsForm.get(control)?.value;
  }

  onProductNameInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const transcribedValue = this.transcribeToTranslit(inputValue);
    this.toolsForm.patchValue({
      toolsLink: transcribedValue
    });
  }

  transcribeToTranslit(input: string): string {
    const transliteration = require('transliteration.cyr');
    let transliteratedValue = transliteration.transliterate(input);
    transliteratedValue = transliteratedValue.replace(/\s+/g, '_');
    return transliteratedValue;
  }



  close(): void {
    this.dialogRef.close();
  }
}
