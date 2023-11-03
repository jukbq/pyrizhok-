import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeElementsComponent } from './recipe-elements.component';

describe('RecipeElementsComponent', () => {
  let component: RecipeElementsComponent;
  let fixture: ComponentFixture<RecipeElementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeElementsComponent]
    });
    fixture = TestBed.createComponent(RecipeElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
