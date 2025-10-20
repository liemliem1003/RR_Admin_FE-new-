import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { MenuItemService } from '../../../services/menu-item.service';
import { ProductService } from '../../../services/product.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.html',
  styleUrls: ['./menu-details.scss'],
  imports: [CommonModule, FormsModule, NgIf]
})
export class MenuDetails implements OnInit {
  menu: any;
  items: any[] = [];
  products: any[] = [];
  loading = false;
  modalOpen = false;
  menuItems: any =[]
  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private menuItemService: MenuItemService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMenu(+id);
      this.loadMenuItem(+id);
      this.loadProducts();
    }
  }

  loadMenu(id: number) {
    this.menuService.getById(id).subscribe({
      next: (res: any) => {
        this.menu = res.menu;
        this.items = this.menu.items || [];
      },
      error: () => {
        console.error('Không thể tải menu');
        this.loading = false;
      }
    });
  }

loadMenuItem(id: number) {
    this.menuItemService.getByMenu(id).subscribe({
      next: (res: any) => {
        this.menuItems = res.items;
        console.log(res);
        

      },
      error: () => {
        console.error('Không thể tải menu');
        this.loading = false;
      }
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        const productsArray = Array.isArray(res) ? res : res.products || [];
        this.products = productsArray.map((p: any) => ({
          ...p,
          selected: false,
          priceOverride: p.base_price,

        }));
      },
      error: () => console.error('Không thể tải sản phẩm')
    });
  }

  // Mở modal (Bootstrap JS)
  openModal() {
    this.modalOpen = true;
  }
  closeModal() {
    this.modalOpen = false;
  }

  addSelectedProducts() {
    const selected = this.products.filter(p => p.selected).map(p => ({
      ...p,
      menu_id: this.menu.id,
      product_id: p.id,
      display_name: p.name,
      price: p.base_price
    })
    )
    if (!selected.length) return;
    console.log(selected);

    selected.forEach(p => {
      this.menuItemService.addProductToMenu(p)
        .subscribe(item => {
          this.items.push(item);
        });
    });

    this.closeModal();
    this.products.forEach(p => (p.selected = false));
  }

  saveItem(item: any) {
    console.log(item);

    this.menuItemService.updateMenuItem(item.id, { price: item.price })
      .subscribe({
        next: () => console.log('Đã lưu món'),
        error: () => console.error('Không thể lưu món')
      });
  }

  deleteItem(id: number) {
    if (!confirm('Xoá món này?')) return;
    this.menuItemService.deleteMenuItem(id).subscribe({
      next: () => this.items = this.items.filter(x => x.id !== id),
      error: () => console.error('Không thể xoá món')
    });
  }
}
