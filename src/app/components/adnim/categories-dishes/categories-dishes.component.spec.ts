import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesDishesComponent } from './categories-dishes.component';

describe('CategoriesDishesComponent', () => {
  let component: CategoriesDishesComponent;
  let fixture: ComponentFixture<CategoriesDishesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesDishesComponent]
    });
    fixture = TestBed.createComponent(CategoriesDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
