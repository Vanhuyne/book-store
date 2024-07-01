// shared/prime-ng.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ],
  declarations: [
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule{}
