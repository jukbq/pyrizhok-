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
import { RecipesResponse } from '../../interfaces/recipes';
@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesArr!: Array<RecipesResponse>;
  private recipesCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.recipesCollection = collection(this.afs, 'recipes');
  }

  getAll() {
    return collectionData(this.recipesCollection, { idField: 'id' });
  }

  getAllrecipes(name: string) {
    return collectionData(this.recipesCollection, { idField: 'name' });
  }


  addRecipess(recipes: RecipesResponse) {
    return addDoc(this.recipesCollection, recipes);
  }


  editrecipes(recipes: RecipesResponse, id: string) {
    const recipesDocumentReference = doc(this.afs, `recipes/${id}`);
    return updateDoc(recipesDocumentReference, { ...recipes });
  }

  delRecipess(id: any) {
    const recipesDocumentReference = doc(this.afs, `recipes/${id}`);
    return deleteDoc(recipesDocumentReference);
  }



}
