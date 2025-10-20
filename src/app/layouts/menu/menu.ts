import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { StoreService } from '../../services/store.service';

interface StoreItem {
  id: number;
  name: string;
}

interface MenuItem {
  id?: number;
  name: string;
  store_id: number;     // 🔹 Lưu id trực tiếp
  store?: StoreItem | null; // 🔹 Dùng để hiển thị nếu backend có include
  is_default: boolean;
  note?: string | null;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIf],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
})
export class Menu implements OnInit {
  stores: StoreItem[] = [];
  menus: MenuItem[] = [];

  searchMenu = '';
  searchStore = '';
  filterDefault: boolean | null = null;

  modalOpen = false;
  editingMenu: MenuItem | null = null;

  // 🟢 menu đang được tạo/sửa
  menu: MenuItem = { name: '', store_id: 0, is_default: false };

  loading = false;

  constructor(
    public menuService: MenuService,
    public storeService: StoreService
  ) {}

  // 🟦 Load dữ liệu ban đầu
  ngOnInit() {
    this.loadMenus();
    this.loadStores();
  }

  // 🟢 Load danh sách menu
  loadMenus() {
    this.loading = true;
    this.menuService.getAll().subscribe({
      next: (res: any) => {
        this.menus = res.menus || res.data || res || [];
        this.loading = false;
      },
      error: () => {
        console.error('Không thể tải danh sách menu');
        this.loading = false;
      },
    });
  }

  // 🏬 Load danh sách store
  loadStores() {
    this.loading = true;
    this.storeService.getAll().subscribe({
      next: (res: any) => {
        this.stores = res.stores || res.data || res || [];
        this.loading = false;
      },
      error: () => {
        console.error('Không thể tải danh sách cửa hàng');
        this.loading = false;
      },
    });
  }

  // 🔍 Lọc
  filteredMenus() {
    return this.menus.filter((m) => {
      const matchMenu =
        !this.searchMenu ||
        m.name.toLowerCase().includes(this.searchMenu.toLowerCase());
      const storeName =
        m.store?.name ||
        this.stores.find((s) => s.id === m.store_id)?.name ||
        '';
      const matchStore =
        !this.searchStore ||
        storeName.toLowerCase().includes(this.searchStore.toLowerCase());
      const matchDefault =
        this.filterDefault === null || m.is_default === this.filterDefault;
      return matchMenu && matchStore && matchDefault;
    });
  }

  // 🟢 Mở modal
  openModal() {
    this.modalOpen = true;
  }

  // 🔴 Đóng modal
  closeModal() {
    this.modalOpen = false;
    this.editingMenu = null;
    this.menu = { name: '', store_id: 0, is_default: false };
  }

  // ✏️ Sửa menu
  editMenu(m: MenuItem) {
    this.editingMenu = m;
    this.menu = {
      id: m.id,
      name: m.name,
      is_default: !!m.is_default,
      note: m.note,
      store_id: m.store_id,
    };
    this.modalOpen = true;
  }
getStoreName(menu: any): string {
  return menu.store?.name || this.stores.find(s => s.id === menu.store_id)?.name || '—';
}
  // 💾 Lưu
  saveMenu() {
    if (!this.menu.name.trim()) {
      alert('Vui lòng nhập tên menu');
      return;
    }

    if (!this.menu.store_id) {
      alert('Vui lòng chọn cửa hàng');
      return;
    }

    const payload = { ...this.menu };

    if (this.editingMenu) {
      this.menuService.update(this.editingMenu.id!, payload).subscribe({
        next: () => {
          this.loadMenus();
          this.closeModal();
        },
        error: () => alert('Không thể cập nhật menu'),
      });
    } else {
      this.menuService.create(payload).subscribe({
        next: () => {
          this.loadMenus();
          this.closeModal();
        },
        error: () => alert('Không thể tạo menu'),
      });
    }
  }

  // 🗑️ Xoá
  deleteMenu(m: MenuItem) {
    if (!confirm('Bạn có chắc muốn xoá menu này?')) return;

    this.menuService.delete(m.id!).subscribe({
      next: () => this.loadMenus(),
      error: () => alert('Không thể xoá menu'),
    });
  }
}
