import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoucherCategory } from './voucher-category/voucher-category';
import { VoucherProduct } from './voucher-product/voucher-product';
import { VoucherStore } from './voucher-store/voucher-store';
import { VoucherUsage } from './voucher-usage/voucher-usage';
import { VoucherService } from '../../services/voucher.service'; // 🟢 Thêm dòng này

@Component({
  selector: 'app-voucher',
  standalone: true,
  templateUrl: './voucher.html',
  styleUrls: ['./voucher.scss'],
  imports: [CommonModule, FormsModule, VoucherCategory, VoucherProduct, VoucherStore, VoucherUsage, NgIf, NgFor],
})
export class Voucher implements OnInit {
changePage(arg0: number) {
throw new Error('Method not implemented.');
}
page: any;
totalPages: any;
  constructor(private voucherService: VoucherService) {} // 🟢 Inject service

  tabs = ['Voucher List', 'Stores', 'Categories', 'Products', 'Usage History'];
  activeTab = 'Voucher List';

  voucherTypes = [
    { value: 'fixed', label: 'Giảm tiền cố định' },
    { value: 'percent', label: 'Giảm theo %' },
    { value: 'free_shipping', label: 'Miễn phí vận chuyển' },
    { value: 'buy_x_get_y', label: 'Mua X tặng Y' },
    { value: 'min_total_gift', label: 'Đơn tối thiểu tặng món' },
    { value: 'product_gift', label: 'Mua món tặng món' },
    { value: 'first_order', label: 'Đơn đầu tiên' },
    { value: 'birthday', label: 'Sinh nhật' },
    { value: 'category_discount', label: 'Giảm theo danh mục' },
    { value: 'limited_time', label: 'Flash Sale' },
    { value: 'combo_discount', label: 'Combo giảm giá' },
  ];

  vouchers: any[] = [];
  filteredVouchers: any[] = [];
  searchTerm = '';

  modalOpen = false;
  editingVoucher: any = null;

  voucher: any = this.emptyVoucher();
  loading = false;

  // 🟩 Khi khởi tạo
  ngOnInit() {
    this.loadVouchers();
  }

  // 🟢 Hàm gọi API để lấy danh sách voucher
  loadVouchers() {
    this.loading = true;
    this.voucherService.getAll().subscribe({
      next: (res: any) => {
        this.vouchers = res.vouchers || res.data || res || [];
        this.filteredVouchers = [...this.vouchers];
        this.loading = false;
      },
      error: (err) => {
        console.error('Không thể tải danh sách voucher:', err);
        this.loading = false;
      },
    });
  }

  emptyVoucher() {
    return {
      code: '',
      name: '',
      type: 'fixed',
      rules: {},
      start_at: '',
      end_at: '',
      is_active: 1,
      can_combine: 0,
    };
  }

  filterVouchers() {
    const t = this.searchTerm.toLowerCase().trim();
    this.filteredVouchers = !t
      ? [...this.vouchers]
      : this.vouchers.filter((v) =>
          [v.code, v.name].some((x) => x?.toLowerCase().includes(t))
        );
  }

  // 🟢 Mở modal thêm/sửa
  openModal(v: any = null) {
    this.editingVoucher = v;
    this.voucher = v ? JSON.parse(JSON.stringify(v)) : this.emptyVoucher();
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingVoucher = null;
    this.voucher = this.emptyVoucher();
  }

  // 🟩 Gọi API lưu voucher (create/update)
  saveVoucher() {
    if (!this.voucher.code.trim() || !this.voucher.name.trim()) {
      alert('Vui lòng nhập mã và tên voucher');
      return;
    }

    const payload = {
      ...this.voucher,
      is_active: this.voucher.is_active ? 1 : 0,
      can_combine: this.voucher.can_combine ? 1 : 0,
    };

    const req = this.editingVoucher
      ? this.voucherService.update(this.editingVoucher.id || this.editingVoucher.code, payload)
      : this.voucherService.create(payload);

    req.subscribe({
      next: () => {
        this.loadVouchers();
        this.closeModal();
      },
      error: (err) => {
        console.error('Lỗi khi lưu voucher:', err);
        alert('Không thể lưu voucher.');
      },
    });
  }

  // 🟥 Xoá voucher
  deleteVoucher(v: any) {
    if (!confirm(`Xóa voucher "${v.name}"?`)) return;

    const id = v.id || v.code;
    this.voucherService.delete(id).subscribe({
      next: () => this.loadVouchers(),
      error: (err) => {
        console.error('Không thể xoá voucher:', err);
        alert('Xoá thất bại');
      },
    });
  }

  // ✏️ Chỉnh sửa
  editVoucher(v: any) {
    this.openModal(v);
  }
}
