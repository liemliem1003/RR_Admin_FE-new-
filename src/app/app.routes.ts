import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { SignIn } from './features/auth/pages/sign-in/sign-in';
import { Dashboard } from './layouts/dashboard/dashboard';
import { Region } from './layouts/region/region';
import { Store } from './layouts/store/store';
import { Category } from './layouts/category/category';
import { Product } from './layouts/product/product';
import { Menu } from './layouts/menu/menu';
import { MenuDetails } from './layouts/menu/menu-details/menu-details';
import { Order } from './layouts/order/order';
import { User } from './layouts/user/user';
import { Loyalty } from './layouts/loyalty/loyalty';
import { Voucher } from './layouts/voucher/voucher';

//  const routes: Routes = [];
export const routes: Routes = [
  {
    path: 'login',
    component: SignIn,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'regions',
    component: Region,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'store',
    component: Store,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
    
  },
  {
    path: 'category',
    component: Category,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'product',
    component: Product,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'menu',
    component: Menu,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'menu-details/:id',
    component: MenuDetails,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'order',
    component: Order,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'user',
    component: User,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'loyalty',
    component: Loyalty,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: 'voucher',
    component: Voucher,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'store_manager'] }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];