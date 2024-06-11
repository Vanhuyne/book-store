// shared/prime-ng.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
// Import other PrimeNG modules as needed

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    CardModule,
    // Add other PrimeNG modules here
  ],
  exports: [
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    CardModule,
    // Export other PrimeNG modules here
  ]
})
export class PrimeNgModule {}
