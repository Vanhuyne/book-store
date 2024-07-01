// features/features.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

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
    
    // Books components
    // BookListComponent,
    // BookDetailComponent,
    // Other feature components
    // OrdersComponent,
    // ProfileComponent,
  
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    OrderConfirmationComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    NgxPayPalModule,
    
  ],
})
export class FeaturesModule {}
