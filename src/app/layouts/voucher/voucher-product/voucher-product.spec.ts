import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherProduct } from './voucher-product';

describe('VoucherProduct', () => {
  let component: VoucherProduct;
  let fixture: ComponentFixture<VoucherProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
