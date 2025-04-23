// models/delivery.models.ts

/**
 * Customer information
 */
export interface Customer {
    id: number;
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    sector?: string;
    street?: string;
    organization?: string;
    status?: boolean;
    googlePin?: string;
  }
  
  /**
   * Product information
   */
  export interface Product {
    id: number;
    name: string;
    price?: number;
    description?: string;
  }
  
  /**
   * Individual delivery item with quantity and pricing
   */
  export interface DeliveryItem {
    id: number;
    date: string;
    quantity: number;
    price: number;
    productId: number;
    dailyDeliveryId: number;
    product?: Product;
  }
  
  /**
   * Daily delivery record with customer and items
   */
  export interface DailyDelivery {
    id: number;
    date: Date;
    customer: Customer;
    deliveryItems: DeliveryItem[];
  }

    /**
   * Daily delivery record with customer
   */
    export interface DailyDeliverynCustomer {
        id: number;
        date: Date;
        customer: Customer;
        
      }
  
  /**
   * Route ordering information for deliveries
   */
  export interface RouteOrderItem {
    customerId: number;
    index: number;
  }