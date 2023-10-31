import { Injectable } from '@angular/core';
import { CategoriesDishesResponse } from '../../interfaces/categories -dishes';
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

@Injectable({
  providedIn: 'root'
})
export class CategoriesDishesService {
  private categoriesDishesArr!: Array<CategoriesDishesResponse>;
  private categoriesDishesCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.categoriesDishesCollection = collection(this.afs, 'categoriesDishes');
  };
  // Categories

  getAll() {
    return collectionData(this.categoriesDishesCollection, { idField: 'id' });
  }

  getAllCategories(name: string) {
    return collectionData(this.categoriesDishesCollection, { idField: 'name' });
  }

  addCategories(categories: CategoriesDishesResponse) {
    return addDoc(this.categoriesDishesCollection, categories);
  }

  editCategories(categories: CategoriesDishesResponse, id: string) {
    const categoriesDocumentReference = doc(this.afs, `categoriesDishes/${id}`);
    return updateDoc(categoriesDocumentReference, { ...categories });
  }

  delCategories(id: any) {
    const categoriesDocumentReference = doc(this.afs, `categoriesDishes/${id}`);
    return deleteDoc(categoriesDocumentReference);
  }

}
