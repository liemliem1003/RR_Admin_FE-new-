import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voucher-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-product.html',
  styleUrl: './voucher-product.scss'
})
export class VoucherProduct {
  products = [
    { id: 1, name: 'iPhone 15', price: 28000000, selected: true },
    { id: 2, name: 'MacBook Pro', price: 42000000, selected: false },
    { id: 3, name: 'AirPods Pro', price: 6000000, selected: false }
  ];

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + '₫';
  }
}