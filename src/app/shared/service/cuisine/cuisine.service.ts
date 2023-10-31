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
import { СuisineResponse } from '../../interfaces/cuisine';


@Injectable({
  providedIn: 'root'
})
export class CuisineService {
  private cuisineArr!: Array<СuisineResponse>;
  private cuisineCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.cuisineCollection = collection(this.afs, 'cuisine');
  }


  getAll() {
    return collectionData(this.cuisineCollection, { idField: 'id' });
  }

  getAllcuisine(name: string) {
    return collectionData(this.cuisineCollection, { idField: 'name' });
  }


  addCuisine(cuisine: СuisineResponse) {
    return addDoc(this.cuisineCollection, cuisine);
  }


  editCuisine(cuisine: СuisineResponse, id: string) {
    const cuisineDocumentReference = doc(this.afs, `cuisine/${id}`);
    return updateDoc(cuisineDocumentReference, { ...cuisine });
  }

  delCuisine(id: any) {
    const cuisineDocumentReference = doc(this.afs, `cuisine/${id}`);
    return deleteDoc(cuisineDocumentReference);
  }

}
