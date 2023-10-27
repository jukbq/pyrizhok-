import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  public title: string = '';
  public description: string = '';
  public focusKeywords: string = '';
  public keywords: string[] = [];


  constructor() { }

  updateTitle(newTitle: string): void {
    this.title = newTitle;
  }
}
