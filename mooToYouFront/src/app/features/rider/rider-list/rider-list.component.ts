import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { Rider } from '../interfaces/rider.interface';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TokenService } from '../../shared/services/token.service';
import { LoggerService } from '../../shared/services/logger.service';
import { NotificationService } from '../../shared/services/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * RiderListComponent is responsible for displaying a list of riders belonging to a specific organization.
 * It interacts with RiderService for data, uses LoggerService for diagnostics, and NotificationService for user feedback.
 */

@Component({
  selector: 'app-rider-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './rider-list.component.html',
  styleUrl: './rider-list.component.css',
})
export class RiderListComponent implements OnInit {
  /** Indicates if data is currently loading (used for showing spinner/loading state) */
  isLoading = false;

  ngOnInit(): void {}

  /** Holds the currently selected organization ID from the token */
  organizationId = new FormControl('');

  /** Array to hold loaded rider data */
  riders: Rider[] = [];

  /**
   * Constructs the RiderListComponent and immediately attempts to load riders from the organization.
   *
   * @param riderService Service to fetch and manage rider data
   * @param tokenService Service to access stored authentication/organization info
   * @param logger Logging service for diagnostics and audit trails
   * @param notification UI service to show user-facing feedback
   */

  constructor(
    private riderService: RiderService,
    private tokenService: TokenService,
    private logger: LoggerService,
    private notification: NotificationService
  ) {
    this.loadRidersByOrganization();
  }

  /**
   * Loads riders associated with the organization ID from the stored token.
   * Displays loading spinner, logs results, and handles both success and error cases.
   */

  loadRidersByOrganization(): void {
    this.isLoading = true;
    const orgId = this.tokenService.getStoredOrgId();

    if (orgId !== null) {
      this.riderService.getAllRiders(+orgId).subscribe({
        next: (response) => {
          this.riders = response;
          this.isLoading = false;
          this.logger.log('Successfully fetched riders', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.logger.error('Failed to load riders ', error);
          this.notification.show('Error loading riders. Please try again.');
        },
      });
    } else {
      this.isLoading = false;
      this.logger.warn('Organization Id not found in token');
      this.notification.show('Organization not found. Please log in again.');
    }
  }

  /**
   * Soft deletes a rider by ID and updates the rider list locally to reflect the change.
   * Also provides UI and log feedback on success or failure.
   *
   * @param riderId The unique identifier of the rider to be soft deleted
   */

  onDeleteRider(riderId: number): void {
    this.riderService.softDeleteRider(riderId).subscribe({
      next: () => {
        this.riders = this.riders.filter((rider) => rider.id !== riderId);
        this.logger.log('Rider deleted successfully', riderId);
        this.notification.show('Rider deleted successfully');
      },
      error: (error) => {
        this.logger.error('Error deleting Rider : ', error);
        this.notification.show('Failed to delete rider. Please try again');
      },
    });
  }
}
