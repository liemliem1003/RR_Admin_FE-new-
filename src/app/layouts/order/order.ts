import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service'; // đường dẫn tùy cấu trúc của bạn

interface StoreItem {
  id: number;
  name: string;
}

interface OrderItem {
  id?: number;
  store: StoreItem;
  store_id?: number;
  order_code: string;
  final_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status:
    | 'pending'
    | 'processing'
    | 'accepted'
    | 'preparing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  note?: string;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order.html',
  styleUrls: ['./order.scss'],
})
export class Order implements OnInit {
changePage(arg0: number) {
throw new Error('Method not implemented.');
}
  stores: StoreItem[] = [];
  orders: OrderItem[] = [];

  searchOrder = '';
  searchStore = '';
  filterStatus: string | null = null;

  statuses = [
    'pending',
    'processing',
    'accepted',
    'preparing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];
  paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

  modalOpen = false;
  editingOrder: OrderItem | null = null;
  order: OrderItem = {
    store: { id: 0, name: '' },
    order_code: '',
    final_amount: 0,
    payment_status: 'pending',
    order_status: 'pending',
  };

  loading = false;
totalPages: any;
page: any;

  constructor(
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadOrders();
  }

  /** 🏪 Load danh sách store (ở đây tạm mock, có thể gọi API riêng) */
  loadStores() {
    this.stores = [
      { id: 1, name: 'Hanoi Store' },
      { id: 2, name: 'Ho Chi Minh Store' },
    ];
  }

  /** 📦 Load danh sách order từ API */
  loadOrders() {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (res: any) => {
        this.orders = res?.orders || res; // tùy cấu trúc API trả về
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  /** 🔍 Lọc và tìm kiếm */
  filteredOrders() {
    return this.orders.filter((o) => {
      const matchOrder =
        !this.searchOrder ||
        o.order_code.toLowerCase().includes(this.searchOrder.toLowerCase());
      const matchStore =
        !this.searchStore ||
        o.store?.name
          ?.toLowerCase()
          .includes(this.searchStore.toLowerCase());
      const matchStatus =
        !this.filterStatus || o.order_status === this.filterStatus;
      return matchOrder && matchStore && matchStatus;
    });
  }

  /** 📤 Mở modal tạo/sửa */
  openModal() {
    this.modalOpen = true;
  }

  /** ❌ Đóng modal */
  closeModal() {
    this.modalOpen = false;
    this.editingOrder = null;
    this.order = {
      store: this.stores[0],
      order_code: '',
      final_amount: 0,
      payment_status: 'pending',
      order_status: 'pending',
    };
  }

  /** ✏️ Edit */
  editOrder(o: OrderItem) {
    this.editingOrder = o;
    this.order = { ...o };
    this.modalOpen = true;
  }

  /** 💾 Save Order (create hoặc update) */
  saveOrder() {
    const payload = {
      ...this.order,
      store_id: this.order.store.id,
    };

    if (this.editingOrder && this.editingOrder.id) {
      // update
      this.orderService.update(this.editingOrder.id, payload).subscribe({
        next: (res) => {
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      // create
      this.orderService.create(payload).subscribe({
        next: (res) => {
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  /** 🗑️ Xóa order */
  deleteOrder(o: OrderItem) {
    if (!confirm(`Xóa đơn hàng ${o.order_code}?`)) return;

    this.orderService.remove(o.id!).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
