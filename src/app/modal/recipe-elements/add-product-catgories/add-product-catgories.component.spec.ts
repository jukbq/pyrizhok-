import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCatgoriesComponent } from './add-product-catgories.component';

describe('AddProductCatgoriesComponent', () => {
  let component: AddProductCatgoriesComponent;
  let fixture: ComponentFixture<AddProductCatgoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductCatgoriesComponent]
    });
    fixture = TestBed.createComponent(AddProductCatgoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
