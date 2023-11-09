import { Component } from '@angular/core';
import { Router } from '@angular/router';

const LIST: any[] = [
  { name: 'Страви', link: 'dishes' },
  { name: 'Категорії', link: 'categories' },
  { name: 'Кухні', link: 'cuisine' },
  { name: 'Категорії продуктів', link: 'productCategory' },
  { name: 'Продукти', link: 'products' },
  { name: 'Рецепти', link: 'recipes' },

];



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public list: any[] = LIST;
  public activeItem: any;

  constructor(private router: Router) { }

  onSelectItem(item: string): void {
    this.activeItem = item;
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.href = '/';
  }
}
