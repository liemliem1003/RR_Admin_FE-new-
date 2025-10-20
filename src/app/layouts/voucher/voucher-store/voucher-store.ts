import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voucher-store',
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-store.html',
  styleUrl: './voucher-store.scss'
})
export class VoucherStore {
  stores = [
    { id: 1, name: 'Cửa hàng A', selected: true },
    { id: 2, name: 'Cửa hàng B', selected: false },
    { id: 3, name: 'Cửa hàng C', selected: false }
  ];

  toggle(store: any) {
    store.selected = !store.selected;
  }
}