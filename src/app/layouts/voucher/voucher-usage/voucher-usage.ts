import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voucher-usage',
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-usage.html',
  styleUrl: './voucher-usage.scss'
})
export class VoucherUsage {
  usages = [
    { id: 1, user: 'Nguyễn Văn A', order: '#ORD123', discount: 50000, used_at: '2025-10-06 14:32' },
    { id: 2, user: 'Trần Thị B', order: '#ORD124', discount: 120000, used_at: '2025-10-06 16:05' }
  ];

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + '₫';
  }
}
