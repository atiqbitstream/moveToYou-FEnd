import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersAssignedComponent } from './customers-assigned.component';

describe('CustomersAssignedComponent', () => {
  let component: CustomersAssignedComponent;
  let fixture: ComponentFixture<CustomersAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersAssignedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
