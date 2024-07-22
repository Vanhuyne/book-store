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
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
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
    OrderDetailComponent,
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
    SharedModule
  ],
})
export class FeaturesModule {}
