import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherStore } from './voucher-store';

describe('VoucherStore', () => {
  let component: VoucherStore;
  let fixture: ComponentFixture<VoucherStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
