import { TestBed } from '@angular/core/testing';

import { ShortRecipeService } from './short-recipe.service';

describe('ShortRecipeService', () => {
  let service: ShortRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
