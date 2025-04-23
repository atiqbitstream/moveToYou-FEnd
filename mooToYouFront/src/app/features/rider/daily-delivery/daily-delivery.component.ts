// daily-delivery.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { RiderService } from '../services/rider.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { DailyDelivery, RouteOrderItem } from '../interfaces/types';
import {
  calculateTotalBill,
  filterDeliveriesByDataRange,
} from '../utils/rider-utils';

/**
 * COMPONENT PURPOSE:
 * Manages the display and organization of daily delivery routes for logistics personnel.
 * Key Features:
 * - Displays deliveries in a sortable, paginated table
 * - Allows visual reordering of delivery routes via drag-and-drop
 * - Filters deliveries by date range and text search
 * - Calculates and displays total financial metrics
 */
@Component({
  selector: 'app-daily-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    CdkDropList,
    CdkDrag,
    MatSnackBarModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './daily-delivery.component.html',
  styleUrl: './daily-delivery.component.css',
})
export class DailyDeliveryComponent implements OnInit {

  // TABLE CONFIGURATION
  // -------------------
  // Define column IDs that match the matColumnDef values in the template
  readonly displayedColumns: string[] = [
    'customerId',     // Unique customer identifier
    'date',           // Delivery date
    'customer',       // Customer name/details
    'deliveryItems',  // Number/List of items
    'actions',        // Row action buttons
  ];

 // DATA MANAGEMENT
  // ---------------

  // The data source used by Angular Material's table.
// This wraps the delivery data and allows features like filtering, sorting, and pagination.
  dataSource!: MatTableDataSource<DailyDelivery>;


  dailyDeliveries: DailyDelivery[] = [];

// Stores the full, unfiltered list of deliveries as received from the server.
// This is useful when we need to reset filters or reapply date filters without fetching again.
  originalDeliveries: DailyDelivery[] = [];

  // ROUTE ORDERING STATE
  // --------------------
  routeOrder: RouteOrderItem[] = [];  // Stores the current visual order of routes

   /** Bound values for date filtering */
  startDate!: Date | string;
  endDate!: Date | string;

   // FINANCIAL METRICS
  // -----------------
  totalBill = 0;  // Sum of all delivery values (calculated client-side)

/** 
 * The paginator is a control that allows us to display data in pages. 
 * This helps in showing a limited number of records on the table at a time.
 * 
 * The `@ViewChild(MatPaginator)` decorator allows us to access and interact 
 * with the paginator from the component. This is important because it connects 
 * the pagination feature (that you see on the UI) to the logic in the TypeScript file.
 */

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private riderService: RiderService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  /**
   * Initialize component by loading delivery data
   */
  ngOnInit(): void {
    this.loadDeliveryData();
  }

  /**
   * Fetches delivery data with items from the service
   */
  private loadDeliveryData(): void {
    this.riderService.getDailyDelveriesWithItems().subscribe({
      next: (deliveries: DailyDelivery[]) => {
        this.originalDeliveries = deliveries;
        this.dailyDeliveries = deliveries;
        this.dataSource = new MatTableDataSource(deliveries);
        this.dataSource.paginator = this.paginator;
        this.totalBill = calculateTotalBill(deliveries);

        this.notificationService.showSuccess('Deliveries loaded successfully!');
      },
      error: () => {
        this.notificationService.showError('Failed to load delivery data');
      },
    });
  }

  /** 
 * This method allows users to reorder delivery rows by dragging and dropping them.
 * It's triggered when a row is dropped into a new position.
 * 
 * `CdkDragDrop` is part of Angular’s drag-and-drop module, and it gives us access to
 * the event that happens when an item is dropped.
 */

  drop(event: CdkDragDrop<DailyDelivery[]>): void {
    // Find the index (position) of the item that was dragged before the drop
    const previousIndex = this.dataSource.data.findIndex(
      (d) => d === event.item.data // Find the current dragged item
    );
  
    // Move the item in the array from its old position to the new position (after the drop)
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
  
    // After rearranging the items, we create a new array reference and update the table.
    // This is necessary to make Angular detect the changes and update the view.
    this.dataSource.data = [...this.dataSource.data];
  }

/**
 * Builds a new route list based on the current table order.
 *
 * Purpose:
 * After the user reorders deliveries using drag-and-drop, we need to prepare
 * a list that shows each customer's new position in the route.
 *
 *  What it does:
 * - Loops through the current table data.
 * - For each delivery, it grabs the customer ID and assigns a new index (starting from 1).
 *
 *  This updated list (routeOrder) is sent to the server when "Confirm Reorder" is clicked.
 * 
 *  Example:
 * If the table now looks like:
 *  1. Customer A (id = 12)
 *  2. Customer B (id = 25)
 * 
 * This function will make:
 *  [
 *    { customerId: 12, index: 1 },
 *    { customerId: 25, index: 2 }
 *  ]
 */

  private updateRouteOrder(): void {
    this.routeOrder = this.dataSource.data.map((delivery, index) => ({
      customerId: delivery.customer.id,
      index: index + 1,
    }));
  }

  /**
   * Opens confirmation dialog before saving route changes
   */
  confirmReorder(): void {
    this.dialogService
      .confirm({
        title: 'Confirm Reorder',
        message: 'Are you sure you want to save this route order?',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.updateRouteOrder();
          this.submitRouteOrder();
        }
      });
  }

  /**
   * Sends updated route order to the server
   */
  private submitRouteOrder(): void {
    this.riderService.updateRouteOrder(this.routeOrder).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Route order updated successfully!'
        );
      },
      error: () => {
        this.notificationService.showError('Failed to update route order');
      },
    });
  }

  /**
   * Filters table data based on user input
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Applies date range filter to delivery data
   */
  applyDateFilter(): void {
    const filtered = filterDeliveriesByDataRange(
      this.originalDeliveries,
      this.startDate,
      this.endDate
    );
    // Update data source and calculate total bill
    this.dataSource.data = filtered;
    this.totalBill = calculateTotalBill(filtered);
  }

  /**
   * Resets date filters to show all deliveries
   */
  resetDateFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.dataSource.data = this.originalDeliveries;
    this.totalBill = calculateTotalBill(this.originalDeliveries);
  }

  /**
   * Navigates to the delivery item detail page
   */
  navigateToDeliveryItems(dailyDeliveryId: number): void {
    this.router.navigate(['/riders/deliveryItem'], {
      state: { dailyDeliveryId },
    });
  }
}
