import { FormArray } from "@angular/forms"
import { CreateDeliveryItems, DeliveryItem } from "../models/types";
import { error } from "console";


/**
 * Utility function for building delivery item payload.
 */

export class DeliveryItemUtils
{

 /**
   * Prepares a structured payload for creating delivery items.
   * 
   * @param form - The FormArray containing delivery item controls.
   * @param dailyDeliveryId - The ID of the daily delivery.
   * @param currentDate - The current date in ISO format.
   * @returns A CreateDeliveryItems object ready to be sent to the backend, or null if no items selected.
   */

 static createDeliveryItemsPayload(form:FormArray,
    dailyDeliveryId:number,
    currentDate: string):CreateDeliveryItems
 {
    const deliveryItems:DeliveryItem[]= form.controls
    .filter(item=>item.get('quantity')?.value>0)
    .map(item=>({
        dailyDeliveryId,
        productId: item.get('productId')?.value,
        quantity:item.get('quantity')?.value,
        price: item.get('quantity')?.value*item.get('unitPrice')?.value,
        date:currentDate
    }));

    if(deliveryItems.length === 0)
    {
        throw new Error('No delivery items to submit');
    }

    return {
        date:currentDate,
        dailyDeliveryId,
        deliveryItems
    }
 }

}