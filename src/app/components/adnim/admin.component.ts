import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  name: string;
  link: string;
  subItems?: MenuItem[];
}

const LIST: MenuItem[] = [
  { name: 'Рецепти', link: 'recipes' },
  { name: 'Короткі рецепти', link: 'short-recipes' },
  {
    name: 'Данні рецепта', link: '#', subItems: [
      { name: 'Страви', link: 'dishes' },
      { name: 'Категорії', link: 'categories' },
      { name: 'Кухні', link: 'cuisine' },
      { name: 'Методи приготування', link: 'methodCooking' },
      { name: 'Категорії продуктів', link: 'productCategory' },
      { name: 'Продукти', link: 'products' },
      { name: 'Одиниці виміру', link: 'units' },
      { name: 'Інструменти', link: 'tools' },
    ]
  },

];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public list: MenuItem[] = LIST;
  public activeItem: number | undefined;
  public activeSubItem: number | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeItem = 0;
    this.activeSubItem = 0;
  }

  onSelectItem(i: number): void {
    this.activeItem = i;
  }

  onSelectSubItem(link: any, j: number): void {
    this.activeSubItem = j;
  }
  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.href = '/';
  }
}
