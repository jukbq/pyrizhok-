import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMethodCookingComponent } from './add-method-cooking.component';

describe('AddMethodCookingComponent', () => {
  let component: AddMethodCookingComponent;
  let fixture: ComponentFixture<AddMethodCookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMethodCookingComponent]
    });
    fixture = TestBed.createComponent(AddMethodCookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
