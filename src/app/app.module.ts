import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './components/adnim/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './modal/sign-up/sign-up.component';
import { SignInComponent } from './modal/sign-in/sign-in.component';
import { HeaderService } from './shared/service/header/header.service';
import { IngredientComponent } from './modal/ingredient/ingredient.component';
import { AddProductComponent } from './modal/recipe-elements/add-product/add-product.component';
import { AddCategoriesDishesComponent } from './modal/recipe-elements/add-categories-dishes/add-categories-dishes.component';
import { AddCuisineComponent } from './modal/recipe-elements/add-cuisine/add-cuisine.component';
import { AddDishesComponent } from './modal/recipe-elements/add-dishes/add-dishes.component';
import { AddMethodCookingComponent } from './modal/recipe-elements/add-method-cooking/add-method-cooking.component';
import { AddProductCatgoriesComponent } from './modal/recipe-elements/add-product-catgories/add-product-catgories.component';
import { AddToolsComponent } from './modal/recipe-elements/add-tools/add-tools.component';
import { AddUnitsComponent } from './modal/recipe-elements/add-units/add-units.component';
import { DishesService } from './shared/service/dishes/dishes.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdminComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    IngredientComponent,
    AddProductComponent,
    AddCategoriesDishesComponent,
    AddCuisineComponent,
    AddDishesComponent,
    AddMethodCookingComponent,
    AddProductCatgoriesComponent,
    AddToolsComponent,
    AddUnitsComponent,
    UserComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideAnalytics(() => getAnalytics()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAuth(() => getAuth()),
    BsDatepickerModule.forRoot(),
    MatSliderModule,
    SlickCarouselModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,

  ],
  providers: [ScreenTrackingService, UserTrackingService, HeaderService, DishesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
