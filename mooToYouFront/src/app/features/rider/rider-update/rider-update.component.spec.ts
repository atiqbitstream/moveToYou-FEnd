import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderUpdateComponent } from './rider-update.component';

describe('RiderUpdateComponent', () => {
  let component: RiderUpdateComponent;
  let fixture: ComponentFixture<RiderUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
