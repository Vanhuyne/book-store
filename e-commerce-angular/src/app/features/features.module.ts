// features/features.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Auth components
// import { LoginComponent } from './auth/login/login.component';
// import { RegisterComponent } from './auth/register/register.component';

// Books components
// import { BookListComponent } from './books/book-list/book-list.component';
// import { BookDetailComponent } from './books/book-detail/book-detail.component';

// Cart component (placeholder)
// import { CartComponent } from './cart/cart.component';

// Orders component (placeholder)
// import { OrdersComponent } from './orders/orders.component';

// Profile component (placeholder)
// import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    // Auth components
    // LoginComponent,
    // RegisterComponent,
    
    // Books components
    // BookListComponent,
    // BookDetailComponent,
    
    // Other feature components
    // CartComponent,
    // OrdersComponent,
    // ProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
    //   { path: 'login', component: LoginComponent },
    //   { path: 'register', component: RegisterComponent },
    //   { path: 'books', component: BookListComponent },
    //   { path: 'books/:id', component: BookDetailComponent },
    //   { path: 'cart', component: CartComponent },
    //   { path: 'orders', component: OrdersComponent },
    //   { path: 'profile', component: ProfileComponent },
    ]),
  ],
})
export class FeaturesModule {}
