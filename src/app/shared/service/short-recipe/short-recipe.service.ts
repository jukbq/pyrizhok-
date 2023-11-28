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
import { ShortRecipesResponse } from '../../interfaces/short-recipes';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShortRecipeService {
  private shortRecipesArr!: Array<ShortRecipesResponse>;
  private shortRecipesCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.shortRecipesCollection = collection(this.afs, 'short-recipes');
  }

  getAll() {
    return collectionData(this.shortRecipesCollection, { idField: 'id' });
  }

  getAllshortRecipes(name: string) {
    return collectionData(this.shortRecipesCollection, { idField: 'name' });
  }


  addShortRecipess(recipes: ShortRecipesResponse) {
    return addDoc(this.shortRecipesCollection, recipes);
  }


  editShortRecipes(recipes: ShortRecipesResponse, id: string) {
    const shortRecipesDocumentReference = doc(this.afs, `short-recipes/${id}`);
    return updateDoc(shortRecipesDocumentReference, { ...recipes });
  }

  delRecipess(id: any) {
    const shortRecipesDocumentReference = doc(this.afs, `short-recipes/${id}`);
    return deleteDoc(shortRecipesDocumentReference);
  }


}
