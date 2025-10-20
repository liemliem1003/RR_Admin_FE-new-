import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherCategory } from './voucher-category';

describe('VoucherCategory', () => {
  let component: VoucherCategory;
  let fixture: ComponentFixture<VoucherCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
