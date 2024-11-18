import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderCreateComponent } from './rider-create.component';

describe('RiderCreateComponent', () => {
  let component: RiderCreateComponent;
  let fixture: ComponentFixture<RiderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
