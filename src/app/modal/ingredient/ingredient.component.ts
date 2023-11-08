import { Component } from '@angular/core';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent {
  public ingredients: any[] = [];
  public addGroup(): void {
    this.ingredients.push({
      name: '',
      group: [
        {
          productsCategory: '',
          ingredients: '',
          amountProdukt: 0,
          unitsMeasure: '',
          notes: ''
        }
      ]
    });
  }
  public addIngredient(index: number): void {
    this.ingredients[index].group.push({
      productsCategory: '',
      ingredients: '',
      amountProdukt: 0,
      unitsMeasure: '',
      notes: ''
    });
  }




  nameIngGroup(value: string) { }
}
