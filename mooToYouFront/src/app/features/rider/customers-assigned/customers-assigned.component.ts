import { TokenService } from './../../shared/services/token.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { Customer } from '../../customer/customer-update/customer-update.component';
import { RiderService } from '../services/rider.service';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { ConfirmationDialogData } from '../../shared/components/layout/confirmation-dialog/confirmation-dialog.component';

/**
 * Displays and manages customers assigned to the current logged-in rider.
 * Handles data retrieval, confirmation dialogs for daily delivery assignments,
 * and provides user feedback through notification services.
 */

@Component({
  selector: 'app-customers-assigned',
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
  ],
  templateUrl: './customers-assigned.component.html',
  styleUrl: './customers-assigned.component.css',
})
export class CustomersAssignedComponent implements OnInit {
  /**
   * Called once the component is initialized. Retrieves the rider ID from token
   * and fetches the assigned customers for display.
   */

  ngOnInit(): void {
    this.riderId = this.tokenService.getUserId();
    this.onGetAssignedCustomers(this.riderId);
  }

  /** List of customers currently assigned to the rider */
  customers: Customer[] = [];

  /** Current rider's user ID retrieved from the token service */
  riderId!: number;

  /**
   * Initializes required services for routing, dialog handling, notifications,
   * and data interaction with rider-related operations.
   *
   * @param riderService Provides methods for interacting with rider data and assignments
   * @param tokenService Retrieves the current user's ID and auth info from token
   * @param dialog Angular Material Dialog service
   * @param router Angular router for navigation
   * @param notification Service to display user-facing success or error messages
   * @param dialogService Wrapper for confirmation dialogs with promises
   */

  constructor(
    private riderService: RiderService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private router: Router,
    private notification: NotificationService,
    private dialogService: DialogService
  ) {}

  /**
   * Fetches customers assigned to the given rider and populates the local state.
   * Displays an error notification if the request fails.
   *
   * @param riderId The ID of the rider whose assigned customers should be fetched
   */

  onGetAssignedCustomers(riderId: number): void {
    this.riderService.getAssignedCustomersForRider(riderId).subscribe({
      next: (response) => {
        this.customers = response;
      },
      error: (err) => {
        this.notification.showError('Failed to load assigned customers');
      },
    });
  }

  /**
   * Opens a confirmation dialog before assigning a daily delivery to a customer.
   * If confirmed, calls the backend service to assign the delivery and navigates to the daily delivery list view.
   * Handles both success and error outcomes with appropriate notifications.
   *
   * @param customer The customer object to assign a delivery to
   */

  async openCustomerSelectionDialog(customer: Customer): Promise<void> {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirm Adding Delivery',
      message: `Are you sure want to add a delivery to ${customer.firstName} ${
        customer.lastName
      } today  ${new Date().toLocaleString()} ?`,
    };

    try {
      const confirmed = await this.dialogService.confirm(dialogData);

      if (confirmed) {
        await firstValueFrom(
          this.riderService.assignDailyDelivery(customer.id)
        );

        this.notification.showSuccess('Delivery assigned successfully');
        this.router.navigate(['/riders/dailyDeliveries']);
      }
    } catch (error) {
      console.error('Error assigning delivery', error);
      this.notification.showError('Failed to assign customer');
    }
  }
}
