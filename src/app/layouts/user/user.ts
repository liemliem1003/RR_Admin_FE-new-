import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../core/services/auth.service';

interface StoreItem {
  id: number;
  name: string;
}

interface UserAccountItem {
  id?: number;
  uuid: string;
  phone?: string;
  email?: string;
  password_hash?: string;
  display_name: string;
  password: string;
  avatar_url?: string;
  role: 'end_user' | 'admin' | 'store_manager' | 'staff';
  store?: StoreItem | null;
  store_id?: number | null;
  is_active: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  point?: string;
  nextLevel?: string;
}

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './user.html',
  styleUrls: ['./user.scss'],
})
export class User implements OnInit {
  changePage(arg0: number) {
    throw new Error('Method not implemented.');
  }
  roles: UserAccountItem['role'][] = ['end_user', 'admin', 'store_manager', 'staff'];
  searchTerm: string = '';
  users: UserAccountItem[] = [];
  filteredUsers: UserAccountItem[] = [];
  stores: StoreItem[] = [];

  user: UserAccountItem = {
    uuid: '',
    display_name: '',
    role: 'end_user',
    is_active: 1,
    password: ""
  };

  editingUser: UserAccountItem | null = null;
  modalOpen = false;
  loading = false;
  page: any;
  totalPages: any;

  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private authService: AuthService
  ) { }

  // 🟩 Khi load component thì lấy danh sách người dùng
  ngOnInit() {
    this.loadUsers();
    this.loadStores()
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res: any) => {
        console.log(res);

        this.users = res.users;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách user:', err);
        this.loading = false;
      },
    });
  }

  loadStores() {
    this.loading = true;
    this.storeService.getAll().subscribe({
      next: (res: any) => {
        console.log(res);
        this.stores = res.stores
        // this.users = res.store;
        // this.filteredUsers = [...this.users];
        // this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách user:', err);
        this.loading = false;
      },
    });
  }

  // 🟦 Lọc người dùng theo tên/email/sđt
  filterUsers() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (u) =>
        (u.display_name?.toLowerCase().includes(term)) ||
        (u.email?.toLowerCase().includes(term)) ||
        (u.phone?.toLowerCase().includes(term))
    );
  }

  // 🟨 Mở modal tạo/sửa user
  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingUser = null;
    this.user = {
      uuid: '',
      display_name: '',
      role: 'end_user',
      is_active: 1,
      password: ""
    };
  }

  // 🟧 Lưu (tạo hoặc cập nhật)
  saveUser() {
    console.log(this.user);
    this.user.store_id = this.user.store?.id
    if (this.editingUser && this.editingUser.id) {

      // cập nhật
      this.userService.update(this.editingUser.id, this.user).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi khi cập nhật user:', err),
      });
    } else {
      // tạo mới
      this.userService.create(this.user).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => console.error('Lỗi khi tạo user:', err),
      });
      // const data = {
      //   name: this.user.display_name,
      //   email: this.user.email,
      //   password: this.user.password,
      //   phone: this.user.phone
      // }
      // this.authService.register(data).subscribe({
      //   next: (res) => {
      //     this.loading = false;
      //     alert('✅ Registration successful! You can now sign in.');
      //   },
      //   error: (err) => {
      //     this.loading = false;
      //   },
      // });
    }
  }

  // 🟥 Xóa
  deleteUser(u: UserAccountItem) {
    if (!u.id) return;
    if (!confirm(`Xóa người dùng "${u.display_name}"?`)) return;

    this.userService.delete(u.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Lỗi khi xóa user:', err),
    });
  }

  // ✏️ Sửa
  editUser(u: UserAccountItem) {
    this.editingUser = u;
    this.user = { ...u };
    this.modalOpen = true;
  }

  // ⚙️ Bật/tắt hoạt động
  toggleActive(u: UserAccountItem) {
    if (!u.id) return;
    const newStatus = !u.is_active;
    this.userService.toggleActive(u.id, newStatus).subscribe({
      next: (res) => {
        u.is_active = res.user.is_active;
      },
      error: (err) => console.error('Lỗi khi đổi trạng thái:', err),
    });
  }
}
