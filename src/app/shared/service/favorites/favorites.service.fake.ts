import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesServiceFake {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  private fakeFavorites: { userId: string; productId: string }[] = [
    // Ваші фейкові дані тут
    { userId: 'user1', productId: 'product1' },
    { userId: 'user1', productId: 'product2' },
    // інші фейкові дані
  ];

  constructor() {
    this.loadFakeFavorites();
  }

  loadFakeFavorites() {
    // Симуляція завантаження улюблених товарів
    const favoritesByUser = this.fakeFavorites.filter(
      (favorite) => favorite.userId === 'user1' // Замініть на ваш ID користувача для фейкових даних
    );
    this.favoritesSubject.next(
      favoritesByUser.map((favorite) => favorite.productId)
    );
  }

  addToFavorites(userId: string, productId: string): Promise<any> {
    // Симуляція додавання товару до списку улюблених
    this.fakeFavorites.push({ userId, productId });
    this.loadFakeFavorites();
    return Promise.resolve();
  }

  removeFromFavorites(userId: string, productId: string): Promise<void> {
    // Симуляція видалення товару із списку улюблених
    this.fakeFavorites = this.fakeFavorites.filter(
      (favorite) => !(favorite.userId === userId && favorite.productId === productId)
    );
    this.loadFakeFavorites();
    return Promise.resolve();
  }

  getFavoritesByUser(userId: string): Observable<any[]> {
    // Симуляція отримання списку улюблених товарів для користувача
    const favoritesByUser = this.fakeFavorites.filter(
      (favorite) => favorite.userId === userId
    );
    return new Observable((observer) => {
      observer.next(favoritesByUser);
      observer.complete();
    });
  }

  getOneFavoriteProduct(userId: string, productId: string): Observable<any | null> {
    // Симуляція отримання одного улюбленого товару
    const favoriteProduct = this.fakeFavorites.find(
      (favorite) => favorite.userId === userId && favorite.productId === productId
    );
    return new Observable((observer) => {
      observer.next(favoriteProduct || null);
      observer.complete();
    });
  }
}


