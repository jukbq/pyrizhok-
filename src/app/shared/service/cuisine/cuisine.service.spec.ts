import { TestBed } from '@angular/core/testing';
import { CuisineService } from './cuisine.service';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Імпортуйте модуль AngularFirestoreModule


describe('CuisineService', () => {
  let service: CuisineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFirestoreModule
      ],
      providers: [
        CuisineService,
      ]
    });
    service = TestBed.inject(CuisineService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
