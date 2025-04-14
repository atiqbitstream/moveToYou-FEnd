import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { RiderService } from '../services/rider.service';
import { ERole } from '../../shared/enums/roles.enum';
import { Rider } from '../interfaces/rider.interface';

import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { FormBaseService } from '../services/form-base.service';

/**
 * RiderUpdateComponent
 * ---------------------
 * Handles loading and updating a rider's details via a reactive form.
 * Extends shared form logic from FormBaseService.
 * Includes error handling, notifications, and cleanup on destroy.
 */

@Component({
  selector: 'app-rider-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './rider-update.component.html',
  styleUrl: './rider-update.component.css',
})
export class RiderUpdateComponent
  extends FormBaseService
  implements OnInit, OnDestroy
{
  // Destroy subject to manage subscriptions and cleanup
  private destroy$ = new Subject<void>();

  // Flag to show loading spinner during async operations
  isLoading = false;

   // To hold the rider's ID fetched from route parameters
  riderId!: number;

    // Roles enumeration to be used in the form
  roles = Object.values(ERole);

  constructor(
    fb: FormBuilder,
    private riderService: RiderService,
    private router: Router,
    private route: ActivatedRoute,
    notification: NotificationService,
    logger: LoggerService
  ) {
    // Calling the parent class constructor for form handling
    super(fb, notification, logger);
  }

  ngOnInit(): void {
    this.setupOrganizationListener();
    this.loadRiderData(); // Load the rider data based on the route parameter
  }

  
  /**
   * This method loads rider data using the rider's ID from the route parameters.
   * It uses the RiderService to fetch the data and updates the form accordingly.
   */

  private loadRiderData(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.riderId = +params['id'];
          return this.riderService.getRider(this.riderId);
        }),
        catchError((error) => {
          this.handleLoadError(error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((rider: Rider | null) => {
        if (rider) this.populateForm(rider);
      });
  }

  /**
   * This method populates the form with the fetched rider data.
   */

  private populateForm(rider: Rider): void {
    this.form.patchValue({
      ...rider,
      role: rider.role,
      organization: rider.organization,
    });
  }

  /**
   * Method called when the user submits the form to update the rider.
   * It validates the form and sends the update request to the service.
   */

  onRiderUpdate(): void {
    if (!super.validateForm('updating rider')) return; // Validate the form before proceeding

    this.isLoading = true;

     // Call the update method in RiderService with the form values and rider ID
    this.riderService
      .updateRider(this.form.value, this.riderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleUpdateSuccess(),
        error: (err) => {
          this.isLoading = false;
          super.handleFormError(err, 'Rider update');
        },
      });
  }

  /**
   * Handles the error when the rider data fails to load.
   * It logs the error, shows a notification, and navigates back to the riders list.
   */

  private handleLoadError(error: any): void {
    this.isLoading = false; // Hide loading spinner
    this.logger.error('Failed to load rider data', error);
    this.notification.show('Error loading rider information');
    this.router.navigate(['/riders']);
  }

   /**
   * Handles the success response when the rider data is updated successfully.
   * It shows a success notification and redirects to the riders list.
   */

  private handleUpdateSuccess(): void {
    this.isLoading = false;
    this.notification.show('Rider updated successfully');
    this.router.navigate(['/riders']);
  }

 // Getter methods to simplify access to form controls in the template
  get username() {
    return this.form.get('username');
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get address() {
    return this.form.get('address');
  }
  get sector() {
    return this.form.get('sector');
  }
  get street() {
    return this.form.get('street');
  }
  get cnicNumber() {
    return this.form.get('cnicNumber');
  }
  get email() {
    return this.form.get('email');
  }
  get role() {
    return this.form.get('role');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
