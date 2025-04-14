import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RiderService } from '../services/rider.service';
import { ERole } from '../../shared/enums/roles.enum';
import { Organization } from '../../shared/interfaces/organization.interface';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { FormBaseService } from '../services/form-base.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * RiderCreateComponent
 * ---------------------
 * Standalone Angular component for creating new rider accounts with validation and role/organization selections.
 * Uses FormBaseService for shared form logic and validation.
 * Submits form data to the RiderService, shows notifications on success or failure.
 */

@Component({
  selector: 'app-rider-create',
  standalone: true,
  templateUrl: './rider-create.component.html',
  styleUrl: './rider-create.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class RiderCreateComponent
  extends FormBaseService
  implements OnInit, OnDestroy
{

   /** Observable cleanup subject */
  private destroy$ = new Subject<void>();

   /** List of roles available for selection */
  roles = Object.values(ERole);

  constructor(
    fb: FormBuilder,
    private riderService: RiderService,
    private snackBar: MatSnackBar,
    notification: NotificationService,
    logger: LoggerService,
    private router: Router
  ) {
    // Calls base class constructor with password field enabled
    super(fb, notification, logger, true);
  }

   /** Lifecycle hook: Initializes the organization listener */
  ngOnInit(): void {
    this.setupOrganizationListener();
  }

  /**
   * Submits the form to create a new rider
   * Validates first, then calls rider service
   */

  onSubmit(): void {
    if (!super.validateForm('creating rider')) return;

    this.riderService
      .createAsRider(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => super.handleFormError(err, 'Rider creation'),
      });
  }

  /**
   * Called after successful rider creation
   * Shows notification, logs event, resets form, navigates back
   */

  private handleSuccess(): void {
    this.notification.show('Rider Created Successfully');
    this.logger.log('New rider created', this.form.value);
    this.form.reset();
    this.router.navigate(['/riders']);
  }

   /** Lifecycle hook: Clean up subscriptions */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
