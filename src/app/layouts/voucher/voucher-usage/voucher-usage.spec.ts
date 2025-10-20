import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherUsage } from './voucher-usage';

describe('VoucherUsage', () => {
  let component: VoucherUsage;
  let fixture: ComponentFixture<VoucherUsage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherUsage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherUsage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
