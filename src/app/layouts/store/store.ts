import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { RegionService } from '../../services/region.service';

interface RegionItem {
  id?: number;
  parent_id?: number | null;
  name: string;
  code?: string | null;
  level?: number;
  img?: string | null;
}

interface StoreItem {
  id?: number;
  name: string;
  region: RegionItem | null;
  address?: string;
  phone?: string;
  email?: string;
  location?: any | null; // 🟢 Sequelize POINT hoặc string POINT()
  current_loyalty_point?: number
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store.html',
  styleUrls: ['./store.scss'],
})
export class Store implements OnInit {
  regions: RegionItem[] = [];
  stores: StoreItem[] = [];
  store: StoreItem = { name: '', region: null, location: null };
  editingStore: StoreItem | null = null;
  modalOpen = false;
  loading = false;

  // 🧭 input tạm để người dùng nhập lat/lon
  latitude: string | null = null;
  longitude: string | null = null;

  constructor(
    public storeService: StoreService,
    public regionService: RegionService
  ) { }

  ngOnInit(): void {
    this.loadStores();
    this.loadRegions();
  }

  // 🏬 Lấy danh sách cửa hàng
  loadStores() {
    this.loading = true;
    this.storeService.getAll().subscribe({
      next: (res: any) => {
        // Sequelize có thể trả về { stores: [...] } hoặc array trực tiếp
        this.stores = res.stores || res.data || res || [];
        this.loading = false;
        console.log('Stores loaded:', this.stores);
      },
      error: () => {
        console.error('Không thể tải danh sách cửa hàng');
        this.loading = false;
      },
    });
  }

  // 🌍 Lấy danh sách khu vực
  loadRegions() {
    this.loading = true;
    this.regionService.getAll().subscribe({
      next: (res: any) => {
        this.regions = Array.isArray(res)
          ? res
          : res.regions || res.data || [];
        this.loading = false;
        console.log('Regions loaded:', this.regions);
      },
      error: (err) => {
        console.error('Lỗi load region:', err);
        this.loading = false;
      },
    });
  }

  // 🟢 Mở modal
  openModal() {
    this.modalOpen = true;
  }

  // 🔴 Đóng modal & reset form
  closeModal() {
    this.modalOpen = false;
    this.editingStore = null;
    this.store = { name: '', region: this.regions[0] || null, location: null };
    this.latitude = null;
    this.longitude = null;
  }

  // 💾 Lưu (Tạo mới hoặc Cập nhật)
  saveStore() {
    if (!this.store.name.trim()) {
      alert('Vui lòng nhập tên cửa hàng');
      return;
    }

    if (!this.store.region) {
      alert('Vui lòng chọn khu vực (region)');
      return;
    }

    // 🧭 Nếu có lat/lon thì convert sang POINT(lon lat)
    let locationValue: any = null;
    if (this.latitude && this.longitude) {
      locationValue = { type: 'Point', coordinates: [parseFloat(this.longitude), parseFloat(this.latitude)] };
    }

    const payload = {
      ...this.store,
      region_id: this.store.region.id,
      location: locationValue,
    };

    if (this.editingStore) {
      // 🟠 Cập nhật
      this.storeService.update(this.editingStore.id!, payload).subscribe({
        next: () => {
          this.loadStores();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          alert('Không thể cập nhật cửa hàng');
        },
      });
    } else {
      // 🟢 Tạo mới
      this.storeService.create(payload).subscribe({
        next: () => {
          this.loadStores();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          alert('Không thể tạo cửa hàng');
        },
      });
    }
  }

  // ✏️ Sửa cửa hàng
  editStore(s: StoreItem) {
    this.editingStore = s;
    this.store = { ...s };

    // 🧭 Nếu location là string POINT(lon lat)
    if (typeof s.location === 'string') {
      const match = s.location.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
      if (match) {
        this.longitude = match[1];
        this.latitude = match[2];
      }
    } else if (s.location && s.location.coordinates) {
      // Sequelize có thể trả về object { type: 'Point', coordinates: [lon, lat] }
      this.longitude = s.location.coordinates[0];
      this.latitude = s.location.coordinates[1];
    } else {
      this.longitude = null;
      this.latitude = null;
    }

    this.modalOpen = true;
  }

  // 🗑️ Xoá cửa hàng
  deleteStore(s: StoreItem) {
    if (!confirm('Bạn có chắc muốn xoá cửa hàng này?')) return;

    this.storeService.delete(s.id!).subscribe({
      next: () => this.loadStores(),
      error: () => alert('Không thể xoá cửa hàng'),
    });
  }
  compareRegions(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

}
