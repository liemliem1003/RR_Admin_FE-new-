import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

export interface NavChild {
  label: string;
  route: string;
  children?: NavItem[];
}
export interface NavItem {
  label: string;
  route?: string;
  icon?: string; // optional — replace with an <svg> or icon component if you use one
  children?: NavChild[];
}
export interface User {
  name: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  encapsulation: ViewEncapsulation.None
})

export class Nav implements OnInit {
  @Input() items: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'bi bi-speedometer2'
    },
    // {
    //   label: 'Products',
    //   icon: 'bi bi-box-seam',
    //   children: [
    //     { label: 'All products', route: '/products' },
    //     { label: 'Create', route: '/products/create' }
    //   ]
    // },
    {
      label: 'Regions',
      icon: 'bi bi-geo-alt',
      route: '/regions',
    },
    {
      label: 'Store',
      icon: 'bi bi-shop',
      route: '/store',
    },
    {
      label: 'Category',
      icon: 'bi bi-tags',
      route: '/category',
    },
    {
      label: 'Product',
      icon: 'bi bi-bag',
      route: '/product',
    },
    {
      label: 'Menu',
      icon: 'bi bi-list',
      route: '/menu',
    },
    {
      label: 'Order',
      icon: 'bi bi-receipt',
      route: '/order',
    },
    {
      label: 'User',
      icon: 'bi bi-person',
      route: '/user',
    },
    {
      label: 'Loyalty',
      icon: 'bi bi-stars',
      route: '/loyalty',
    },
    {
      label: 'Voucher',
      icon: 'bi bi-ticket-perforated',
      route: '/voucher',
    }

  ];

  @Input() collapsed = true;

  currentPage: string = '';
  openGroups = new Set<string>();
  userMenuOpen = false;

  user: User = {
    name: 'John Doe',
    role: 'Admin',
    avatar: 'assets/avatar.png'
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Update current page on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateCurrentPage(event.urlAfterRedirects);
      });

    // Initial page
    this.updateCurrentPage(this.router.url);
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  toggleGroup(item: NavItem) {
    if (!item.label) return;
    if (this.openGroups.has(item.label)) this.openGroups.delete(item.label);
    else this.openGroups.add(item.label);
  }

  isOpen(item: NavItem) {
    return this.openGroups.has(item.label);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    // implement logout logic here
    console.log('Logout clicked');
  }

  private updateCurrentPage(url: string) {
    const matchingItem = this.items.find(item => item.route === url);
    if (matchingItem) {
      this.currentPage = matchingItem.label;
    } else {
      // Check children
      for (let item of this.items) {
        if (item.children) {
          const child = item.children.find(c => c.route === url);
          if (child) {
            this.currentPage = child.label;
            return;
          }
        }
      }
      this.currentPage = ''; // fallback
    }
  }
}
