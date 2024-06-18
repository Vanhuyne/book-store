import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FeaturesModule,
    HttpClientModule,
    SharedModule,
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
