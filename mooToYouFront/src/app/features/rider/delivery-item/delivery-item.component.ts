import { error } from 'console';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { DeliveryItemUtils } from '../../shared/utils/delivery-item.utils';
import { CreateDeliveryItems, Product } from '../../shared/models/types';
import { NotificationService } from '../../shared/services/notification.service';
import { AppRoutes } from '../../shared/constants/app.constants';
import { NotificationMessages } from '../../shared/constants/messages.constants';
import { LoggerService } from '../../shared/services/logger.service';

@Component({
  selector: 'app-delivery-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './delivery-item.component.html',
  styleUrl: './delivery-item.component.css',
})

/**
 * Component to manage delivery items. It allows adding items to the daily delivery,
 * adjusting quantities, calculating total price, and submitting the form.
 */
export class DeliveryItemComponent implements OnInit {
  // Reactive form group to handle form data
  deliveryItemForm!: FormGroup;

  // Array of products available for delivery
  products: Product[] = [];

  // This ID is passed from the daily deliveries page
  // Daily Delivery ID passed through the router navigation state

  dailyDeliveryId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private riderService: RiderService,
    private logger: LoggerService,
    private notify: NotificationService
  ) {
    // Check if dailyDeliveryId is passed via navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.dailyDeliveryId = navigation.extras.state['dailyDeliveryId'];
    } else {
      // If the ID is missing, alert and navigate back to daily deliveries page
      alert('dailyDeliveryId missing from navigation state');
      this.router.navigate([AppRoutes.RIDER_DAILY_DELIVERIES]);
      return;
    }
  }

  ngOnInit(): void {
    // Initialize the form and fetch products
    this.initializeForm();
    this.fetchAllProducts();
  }

  // Initialize the delivery item form
  initializeForm(): void {
    this.deliveryItemForm = this.fb.group({
      items: this.fb.array([]), // Form array for managing delivery items
    });
  }

  // Getter for form array 'items' for easier access
  get deliveryItemsFormArray() {
    return this.deliveryItemForm.get('items') as FormArray;
  }

  // Calculate the total price of all items in the form
  get totalPrice(): number {
    return this.deliveryItemsFormArray.controls.reduce((total, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      return total + quantity * unitPrice;
    }, 0);
  }

  // Fetch all products from the rider service
  fetchAllProducts() {
    this.riderService.getProducts().subscribe({
      next: (response) => {
        this.products = response; // Assign the products fetched from the server
        this.populateFormArray(); // Initialize the form array with products
      },
      error: (error) => {
        this.logger.error('Failed to load products', error);
        this.notify.show('Failed to load products. please try again later.');
      },
    });
  }

  // Initialize the form array with products data
  populateFormArray() {
    this.products.forEach((product) => {
      this.deliveryItemsFormArray.push(
        this.fb.group({
          productId: [product.id, Validators.required], // Product ID for each item
          unitPrice: [product.price, Validators.required], // Unit price fetched from product entity
          quantity: [0, [Validators.required, Validators.min(0)]], // Quantity with validation (non-negative)
        })
      );
    });
  }

  // Increment quantity for a specific product
  incrementQuantity(index: number) {
    const qtyControl = this.deliveryItemsFormArray.at(index).get('quantity');
    qtyControl?.setValue((qtyControl.value || 0) + 1);
  }

  // Decrement quantity for a specific product
  decrementQuantity(index: number) {
    const qtyControl = this.deliveryItemsFormArray.at(index).get('quantity');
    if (qtyControl && qtyControl?.value > 0) {
      qtyControl.setValue(qtyControl.value - 1);
    }
  }

  // Handle form submission, call the backend service to add delivery items
  submitDeliveryItems(): void {
    if (!this.deliveryItemForm.valid) return;

    try {
      const payload = this.preparePayload();
      if (!payload) return;

      this.sendPayloadToServer(payload);
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }

  //create the payload structure to match the backend dto structure
  private preparePayload(): CreateDeliveryItems | null {
    const currentDate = new Date().toISOString();
    const payload = DeliveryItemUtils.createDeliveryItemsPayload(
      this.deliveryItemsFormArray,
      this.dailyDeliveryId,
      currentDate
    );

    if (!payload) {
      this.notify.show(NotificationMessages.NoItems);
      return null;
    }

    return payload;
  }

  // Call the service to add the items and handle response
  private sendPayloadToServer(payload: CreateDeliveryItems): void {
    this.riderService.addDeliveryItems(payload).subscribe({
      next: () => {
        this.notify.show(NotificationMessages.SaveSuccess);
        this.router.navigate([AppRoutes.RIDER_DAILY_DELIVERIES]);
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: any): void {
    this.logger.error(NotificationMessages.SaveFail, error);
    this.notify.show(NotificationMessages.SaveFail);
  }

  private handleUnexpectedError(error: unknown): void {
    this.logger.error(NotificationMessages.UnexpectedError, error);
    this.notify.show(NotificationMessages.UnexpectedError);
  }

  // Cancel the form and navigate back to the daily deliveries page
  onCancel(): void {
    this.router.navigate([AppRoutes.RIDER_DAILY_DELIVERIES]);
  }
}
