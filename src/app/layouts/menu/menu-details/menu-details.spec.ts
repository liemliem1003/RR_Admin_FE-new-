import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDetails } from './menu-details';

describe('MenuDetails', () => {
  let component: MenuDetails;
  let fixture: ComponentFixture<MenuDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
