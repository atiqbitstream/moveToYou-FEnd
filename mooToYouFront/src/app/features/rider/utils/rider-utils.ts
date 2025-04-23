import { DailyDelivery } from "../interfaces/types";

export function calculateTotalBill(deliveries:DailyDelivery[]):number
{
if(!deliveries || deliveries.length === 0) return 0;

return deliveries.reduce((total,delivery)=>{
    const deliveryTotal = delivery.deliveryItems.reduce((subtotal,item)=>{
        const quantity =Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return subtotal+quantity*price;
    },0) || 0;

    return total+deliveryTotal;
},0)
}


export function filterDeliveriesByDataRange(
    deliveries:DailyDelivery[],
    start:Date | string,
    end : Date | string
):DailyDelivery[]
{
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if(!startDate && !endDate) return deliveries;

    return deliveries.filter(delivery=>{
        const deliveryDate = new Date(delivery.date);

        if(startDate && !endDate) return deliveryDate >=startDate;
        if(!startDate && endDate) return deliveryDate <=endDate;
        return deliveryDate >=startDate! && deliveryDate<=endDate!;
    })
}