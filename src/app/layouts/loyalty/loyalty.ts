import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoyaltyService } from '../../services/loyalty.service';

interface LoyaltyRule {
  id: number;
  tier_name: string;
  min_points: number;
  multiplier: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './loyalty.html',
  styleUrls: ['./loyalty.scss'],
})
export class Loyalty implements OnInit {
  constructor(private loyaltyService: LoyaltyService) { }

  // --- Tab view mode ---
  viewMode: 'rules' | 'accounts' | 'transactions' = 'rules';

  // --- Data ---
  rules: LoyaltyRule[] = [];
  accounts: any[] = [];
  transactions: any[] = [];

  // --- CRUD state ---
  rule: LoyaltyRule = {
    id: 0,
    tier_name: '',
    min_points: 0,
    multiplier: 1.0,
    description: '',
  };
  editingRule: LoyaltyRule | null = null;
  modalOpen = false;

  loading = false;

  ngOnInit() {
    this.loadRules();
  }
  editRule(rule: LoyaltyRule) {
    this.editingRule = { ...rule };
    this.rule = { ...rule };
    this.modalOpen = true;
  }
  // ===================== VIEW TABS =====================
  openMode(view: 'rules' | 'accounts' | 'transactions') {
    this.viewMode = view;
    if (view === 'rules') this.loadRules();
    if (view === 'accounts') this.loadAccounts();
    if (view === 'transactions') this.loadTransactions();
  }

  // ===================== LOYALTY RULE =====================
  loadRules() {
    this.loading = true;
    this.loyaltyService.getAll().subscribe({
      next: (res: any) => {
        this.rules = res.loyalties || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Load rules failed', err);
        this.loading = false;
      },
    });
  }

  openModal(rule?: LoyaltyRule) {
    if (rule) {
      this.editingRule = { ...rule };
      this.rule = { ...rule };
    } else {
      this.editingRule = null;
      this.rule = {
        id: 0,
        tier_name: '',
        min_points: 0,
        multiplier: 1.0,
        description: '',
      };
    }
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingRule = null;
  }

  saveRule() {
    const payload = { ...this.rule };

    if (this.editingRule && this.editingRule.id) {
      // update
      this.loyaltyService.update(this.editingRule.id, payload).subscribe({
        next: () => {
          this.loadRules();
          this.closeModal();
        },
        error: (err) => console.error('Update rule failed', err),
      });
    } else {
      // create
      this.loyaltyService.create(payload).subscribe({
        next: () => {
          this.loadRules();
          this.closeModal();
        },
        error: (err) => console.error('Create rule failed', err),
      });
    }
  }

  deleteRule(id: number) {
    if (!confirm('Xác nhận xóa quy tắc này?')) return;
    this.loyaltyService.delete(id).subscribe({
      next: () => this.loadRules(),
      error: (err) => console.error('Delete rule failed', err),
    });
  }

  // ===================== ACCOUNTS =====================
  loadAccounts() {
    // this.loyaltyService.getAccounts().subscribe({
    //   next: (res: any) => (this.accounts = res.accounts || []),
    //   error: (err) => console.error('Load accounts failed', err),
    // });
  }

  // ===================== TRANSACTIONS =====================
  loadTransactions() {
    // this.loyaltyService.getTransactions().subscribe({
    //   next: (res: any) => (this.transactions = res.transactions || []),
    //   error: (err) => console.error('Load transactions failed', err),
    // });
  }
}
