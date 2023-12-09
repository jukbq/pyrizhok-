import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private afs: Firestore) {
    this.loadFavorites();
  }

  // Отримати список улюблених товарів для користувача
  async loadFavorites() {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    if (customer && customer.uid) {
      const userId = customer.uid;
      this.getFavoritesByUser(userId).subscribe((favorites) => {
        this.favoritesSubject.next(
          favorites.map((favorite) => favorite.productId)
        );
      });
    }
  }

  // Додати товар до списку улюблених
  addToFavorites(
    userId: string,
    productId: string
  ): Promise<DocumentReference<DocumentData>> {
    const favoritesCollection = collection(this.afs, 'favorites');
    return addDoc(favoritesCollection, { userId, productId });
    this.loadFavorites();
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    const favoritesCollection = collection(this.afs, 'favorites');

    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('productId', '==', productId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // Видалення кожного знайденого документа
      await deleteDoc(doc.ref);
    });

    // Після видалення обновіть потрібні дані або викличте метод для перезавантаження списку улюблених
    this.loadFavorites();
    return Promise.resolve();
  }


  // Отримати список улюблених товарів для користувача
  getFavoritesByUser(userId: string): Observable<any[]> {
    const favoritesCollection = collection(this.afs, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', userId));

    return from(getDocs(q)).pipe(
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
    );
  }

  getOneFavoriteProduct(
    userId: string,
    productId: string
  ): Observable<any | null> {
    const favoritesCollection = collection(this.afs, 'favorites');
    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('productId', '==', productId)
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const doc = querySnapshot.docs[0]; // Отримати перший документ (якщо існує)
        return doc ? doc.data() : null; // Повернути дані документа або null, якщо документ не знайдено
      })
    );
  }
}
