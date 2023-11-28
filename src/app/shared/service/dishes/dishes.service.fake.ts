import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DishesResponse } from '../../interfaces/dishes';

@Injectable()
export class DishesServiceFake {
  private dishesData: Array<DishesResponse> = [
    { id: '1', dishesindex: 1, dishesName: 'Dish 1', dishesLink: 'Link 1', image: 'Image 1' },
    { id: '2', dishesindex: 2, dishesName: 'Dish 2', dishesLink: 'Link 2', image: 'Image 2' },
  ];

  getAll(): Observable<DishesResponse[]> {
    return of(this.dishesData);
  }

  getAlldishes(name: string): Observable<DishesResponse[]> {
    return of(this.dishesData.filter(dish => dish.dishesName === name));
  }

  addDishes(dishes: DishesResponse): Observable<any> {
    return of({ success: true, message: 'Dish added successfully' });
  }

  editdishes(dishes: DishesResponse, id: string): Observable<any> {
    return of({ success: true, message: 'Dish edited successfully' });
  }

  delDishes(id: any): Observable<any> {
    return of({ success: true, message: 'Dish deleted successfully' });
  }
}

