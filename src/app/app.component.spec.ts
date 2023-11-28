import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { DishesService } from './shared/service/dishes/dishes.service';
import { DishesResponse } from './shared/interfaces/dishes';
import { Observable, of } from 'rxjs';
import { DishesServiceFake } from './shared/service/dishes/dishes.service.fake';
import { FavoritesService } from './shared/service/favorites/favorites.service';
import { FavoritesServiceFake } from './shared/service/favorites/favorites.service.fake';
import { MatDialogModule } from '@angular/material/dialog';



describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, MatDialogModule],
    declarations: [AppComponent, HeaderComponent],
    providers: [
      { provide: DishesService, useClass: DishesServiceFake },
      { provide: FavoritesService, useClass: FavoritesServiceFake }
    ]

  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'pyrizhok'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('pyrizhok');
  });


});
