import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodCookingComponent } from './method-cooking.component';

describe('MethodCookingComponent', () => {
  let component: MethodCookingComponent;
  let fixture: ComponentFixture<MethodCookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MethodCookingComponent]
    });
    fixture = TestBed.createComponent(MethodCookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
