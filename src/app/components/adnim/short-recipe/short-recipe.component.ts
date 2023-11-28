import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-short-recipe',
  templateUrl: './short-recipe.component.html',
  styleUrls: ['./short-recipe.component.scss']
})
export class ShortRecipeComponent {
  public recipes_form = false;
  public recipesForm!: FormGroup;


  resetForm() {
    this.recipesForm.reset();
  }
}
