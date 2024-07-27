import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { AnalyticsManagementComponent } from './analytics-management/analytics-management.component';
import { roleGuard } from '../auth.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent ,
  },
  { path: 'cart', component: CartComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path :'checkout', component: CheckoutComponent},
  { path :'order-confirmation', component: OrderConfirmationComponent },
  { path: 'request-password-reset', component: RequestPasswordResetComponent },
  { path: 'reset-password', component : ResetPasswordComponent},
  { path: 'product/:id', component: ProductDetailComponent},
  { path: 'profile', component: UserProfileEditComponent ,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN' ,'ROLE_USER']  }
  },
  { path: 'order-detail', component: OrderDetailComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN' ,'ROLE_USER']  }
   },
  { path: 'admin', 
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN']  },
    children: [
      { path : '' , redirectTo : 'products', pathMatch : 'full'},
      { path: 'products', component: ProductManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'customers', component: CustomerManagementComponent },
      // { path: 'analytics', component: AnalyticsManagementComponent }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
