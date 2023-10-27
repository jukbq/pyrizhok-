import { Injectable } from '@angular/core';

import {
  CollectionReference,
  Firestore,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';
import { DishesResponse } from '../../interfaces/dishes';


@Injectable({
  providedIn: 'root'
})
export class DishesService {
  private dishesArr!: Array<DishesResponse>;
  private dishesCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.dishesCollection = collection(this.afs, 'dishes');
  }

  getAll() {
    return collectionData(this.dishesCollection, { idField: 'id' });
  }

  getAlldishes(name: string) {
    return collectionData(this.dishesCollection, { idField: 'name' });
  }


  addDishes(dishes: DishesResponse) {
    return addDoc(this.dishesCollection, dishes);
  }


  editdishes(dishes: DishesResponse, id: string) {
    const dishesDocumentReference = doc(this.afs, `dishes/${id}`);
    return updateDoc(dishesDocumentReference, { ...dishes });
  }

  delDishes(id: any) {
    const dishesDocumentReference = doc(this.afs, `dishes/${id}`);
    return deleteDoc(dishesDocumentReference);
  }


}
