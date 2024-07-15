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
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';

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
    OrderConfirmationComponent,
    RequestPasswordResetComponent,
    ResetPasswordComponent,
    ProductDetailComponent,
    UserProfileEditComponent,
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    NgxPayPalModule,
    ReactiveFormsModule
  ],
})
export class FeaturesModule {}
