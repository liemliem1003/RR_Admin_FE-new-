import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voucher-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-category.html',
  styleUrl: './voucher-category.scss'
})
export class VoucherCategory {
  categories = [
    { id: 1, name: 'Điện thoại', selected: true },
    { id: 2, name: 'Laptop', selected: false },
    { id: 3, name: 'Phụ kiện', selected: false }
  ];
}