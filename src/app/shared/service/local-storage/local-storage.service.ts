import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Збереження даних в локальне сховище для конкретного ключа
  saveData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }


  // Отримання даних з локального сховища за конкретний ключ
  getData(key: string) {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }



}
