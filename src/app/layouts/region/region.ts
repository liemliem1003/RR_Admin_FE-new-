import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionService } from '../../services/region.service';

interface RegionItem {
  id?: number;
  parent_id?: number | null;
  name: string;
  code?: string | null;
  level?: number;
  img?: string | null; // ảnh (đường dẫn file)
}

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './region.html',
  styleUrls: ['./region.scss'],
})
export class Region {
  constructor(private regionService: RegionService) {}

  regions: RegionItem[] = [];
  loading = false;
  modalOpen = false;
  editingRegion: RegionItem | null = null;
  region: RegionItem = { name: '', code: '', level: 0, parent_id: null };
  selectedFile: File | null = null;

  ngOnInit() {
    this.loadRegions();
  }

  loadRegions() {
    this.loading = true;
    this.regionService.getAll().subscribe({
      next: (res: any) => {
        this.regions = res.regions || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi load region:', err);
        this.loading = false;
      },
    });
  }

  openModal() {
    this.modalOpen = true;
    this.editingRegion = null;
    // this.region = { name: '', code: '', level: 0, parent_id: null };
    this.selectedFile = null;
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveRegion() {
    if (!this.region.name) return;

    const formData = new FormData();
    formData.append('name', this.region.name);
    if (this.region.code) formData.append('code', this.region.code);
    if (this.region.level !== undefined)
      formData.append('level', this.region.level.toString());
    if (this.region.parent_id)
      formData.append('parent_id', this.region.parent_id.toString());
    if (this.selectedFile) formData.append('img', this.selectedFile);
  
    const req = this.editingRegion?.id
      ? this.regionService.update(this.editingRegion.id, formData)
      : this.regionService.create(formData);

    req.subscribe({
      next: () => this.loadRegions(),
      error: (err) => console.error('Lỗi lưu region:', err),
    });

    this.closeModal();
  }

  editRegion(r: RegionItem) {
    this.editingRegion = r;
    this.region = { ...r };
    this.modalOpen = true;
  }

  deleteRegion(r: RegionItem) {
    if (!r.id) return;
    this.regionService.remove(r.id).subscribe({
      next: () => this.loadRegions(),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
