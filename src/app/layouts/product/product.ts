import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

interface CategoryItem {
  id?: number;
  name: string;
  slug?: string;
}

interface ProductItem {
  id?: number;
  sku?: string;
  name: string;
  description?: string;
  category_id?: number;
  category?: CategoryItem | null;
  image_url?: string | null;
  base_price: number;
  is_active: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
})
export class Product implements OnInit {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  filterName = '';
  filterCategory: CategoryItem | null = null;
  sortField: 'name' | 'base_price' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  categories: CategoryItem[] = [];
  products: ProductItem[] = [];

  product: ProductItem = { name: '', base_price: 0, is_active: 0 };
  editingProduct: ProductItem | null = null;
  modalOpen = false;
  loading = false;
  selectedFile: File | null = null;

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.products = res.products || res.data || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Không thể tải danh sách sản phẩm:', err);
        this.loading = false;
      },
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.categories = res.categories || res.data || [];
      },
      error: () => console.warn('Không thể tải danh mục'),
    });
  }

  saveProduct() {
    if (!this.product.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    if (this.product.sku) formData.append('sku', this.product.sku);
    if (this.product.description) formData.append('description', this.product.description);
    formData.append('base_price', this.product.base_price.toString());
    if (this.product.category?.id)
      formData.append('category_id', this.product.category.id.toString());
    formData.append('is_active', this.product.is_active ? '1' : '0');
    if (this.selectedFile) formData.append('image_url', this.selectedFile);

    const req = this.editingProduct
      ? this.productService.update(this.editingProduct.id!, formData)
      : this.productService.create(formData);

    req.subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => console.error('Lỗi lưu sản phẩm:', err),
    });
  }

  deleteProduct(p: ProductItem) {
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;

    this.productService.delete(p.id!).subscribe({
      next: () => this.loadProducts(),
      error: () => alert('Không thể xoá sản phẩm'),
    });
  }

  filteredProducts(): ProductItem[] {
    let result = [...this.products];

    if (this.filterName) {
      const search = this.filterName.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(search));
    }

    if (this.filterCategory) {
      result = result.filter((p) => p.category?.id === this.filterCategory?.id);
    }

    result.sort((a, b) => {
      let compare = 0;
      if (this.sortField === 'name') {
        compare = a.name.localeCompare(b.name);
      } else if (this.sortField === 'base_price') {
        compare = a.base_price - b.base_price;
      }
      return this.sortDirection === 'asc' ? compare : -compare;
    });

    return result;
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingProduct = null;
    this.product = { name: '', base_price: 0, is_active: 0 };
    this.selectedFile = null;
  }

  editProduct(p: ProductItem) {
    this.editingProduct = p;
    this.product = { ...p };
    this.modalOpen = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
