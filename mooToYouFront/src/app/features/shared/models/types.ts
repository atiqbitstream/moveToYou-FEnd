/**
 * Represents a product that can be added to a delivery.
 */
export interface Product {
    id: number;
    name: string;
    price: number;
    organizationId: number;
  }
  
  /**
   * Represents a single item in a delivery submission.
   */
  export interface DeliveryItem {
    quantity: number;
    price: number;
    productId: number;
    dailyDeliveryId: number;
    date: string;
  }
  
  /**
   * The full payload structure expected by the backend when creating delivery items.
   */
  export interface CreateDeliveryItems {
    date: string;
    dailyDeliveryId: number;
    deliveryItems: DeliveryItem[];
  }