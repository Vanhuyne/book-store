import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FeaturesModule } from './features/features.module';
import { PrimeNgModule } from './shared/prime-ng.module';



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FeaturesModule,
    HttpClientModule,
    PrimeNgModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
