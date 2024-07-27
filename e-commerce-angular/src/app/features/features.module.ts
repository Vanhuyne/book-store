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
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { AnalyticsManagementComponent } from './analytics-management/analytics-management.component';
import { BaseChartDirective  } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { PaginationComponent } from './pagination/pagination.component';

Chart.register(...registerables);
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
    DashboardComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    CustomerManagementComponent,
    AnalyticsManagementComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule,
    SharedModule,
    BaseChartDirective
  ],
})
export class FeaturesModule {}
