import { TestBed } from '@angular/core/testing';

import { CategoriesDishesService } from './categories-dishes.service';

describe('CategoriesDishesService', () => {
  let service: CategoriesDishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
