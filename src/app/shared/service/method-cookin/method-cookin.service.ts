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
import { MethodCookinResponse } from '../../interfaces/method-cooking';

@Injectable({
  providedIn: 'root'
})
export class MethodCookinService {
  private methodCookinArr!: Array<MethodCookinResponse>;
  private methodCookinCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.methodCookinCollection = collection(this.afs, 'methodCookin');
  }


  getAll() {
    return collectionData(this.methodCookinCollection, { idField: 'id' });
  }

  getAllmethodCookin(name: string) {
    return collectionData(this.methodCookinCollection, { idField: 'name' });
  }


  addMethodCookin(methodCookin: MethodCookinResponse) {
    return addDoc(this.methodCookinCollection, methodCookin);
  }


  editMethodCookin(methodCookin: MethodCookinResponse, id: string) {
    const methodCookinDocumentReference = doc(this.afs, `methodCookin/${id}`);
    return updateDoc(methodCookinDocumentReference, { ...methodCookin });
  }

  delmethodCookin(id: any) {
    const methodCookinDocumentReference = doc(this.afs, `methodCookin/${id}`);
    return deleteDoc(methodCookinDocumentReference);
  }
}
