import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoriesDishesComponent } from './add-categories-dishes.component';

describe('AddCategoriesDishesComponent', () => {
  let component: AddCategoriesDishesComponent;
  let fixture: ComponentFixture<AddCategoriesDishesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCategoriesDishesComponent]
    });
    fixture = TestBed.createComponent(AddCategoriesDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
