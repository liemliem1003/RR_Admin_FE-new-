import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

interface CategoryItem {
  id?: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  parent?: CategoryItem | null;
  sort_order?: number;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.scss'],
})
export class Category implements OnInit {
  categories: CategoryItem[] = [];
  category: CategoryItem = { name: '', parent: null, sort_order: 0 };
  editingCategory: CategoryItem | null = null;
  modalOpen = false;
  loading = false;

  // 🔍 Thêm state tìm kiếm & phân trang
  search = '';
  sort = 'created_at';
  order: 'ASC' | 'DESC' = 'DESC';
  page = 1;
  limit = 10;
  totalPages = 1;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.limit,
      search: this.search,
      sort: this.sort,
      order: this.order,
    };

    this.categoryService.getAll(params).subscribe({
      next: (res: any) => {
        this.categories = res.category || [];
        this.totalPages = res.pagination?.totalPages || 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Không thể tải danh mục:', err);
        this.loading = false;
      },
    });
  }

  // 🔼 Sắp xếp
  setSort(field: string) {
    if (this.sort === field) this.order = this.order === 'ASC' ? 'DESC' : 'ASC';
    else this.sort = field;
    this.loadCategories();
  }

  // ⏩ Chuyển trang
  changePage(p: number) {
    this.page = p;
    this.loadCategories();
  }

  // CRUD giữ nguyên
  saveCategory() {
    const payload = { ...this.category, parent_id: this.category.parent?.id || null };
    if (this.editingCategory) {
      this.categoryService.update(this.editingCategory.id!, payload).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
      });
    } else {
      this.categoryService.create(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
      });
    }
  }

  deleteCategory(c: CategoryItem) {
    if (!confirm('Bạn có chắc muốn xoá danh mục này?')) return;
    this.categoryService.delete(c.id!).subscribe({
      next: () => this.loadCategories(),
    });
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingCategory = null;
    this.category = { name: '', parent: null, sort_order: 0 };
  }

  editCategory(c: CategoryItem) {
    this.modalOpen = true;
    this.editingCategory = c;
    this.category = { ...c };
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  updateSlug() {
    this.category.slug = this.slugify(this.category.name || '');
  }
}
