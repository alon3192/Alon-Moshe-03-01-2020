import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { DailyForecastComponent } from './daily-forecast/daily-forecast.component';
import { LocationToastComponent } from './location-toast/location-toast.component';
import { ErrorToastComponent } from './error-toast/error-toast.component';
import { FavoriteCardComponent } from './favorite-card/favorite-card.component';
import { SkyComponent } from './sky/sky.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FavoritesComponent,
    CityDetailComponent,
    DailyForecastComponent,
    LocationToastComponent,
    ErrorToastComponent,
    FavoriteCardComponent,
    SkyComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
