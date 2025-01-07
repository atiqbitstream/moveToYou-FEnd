import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { RiderService } from '../services/rider.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from '../../shared/components/layout/confirmation-dialog/confirmation-dialog.component';
import { response } from 'express';
import { error } from 'console';


export interface DailyDeliveryWithCustomer {
  id: number;
  date: Date;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    sector: string;
    street: string;
    organization:string;
    status:boolean;
    googlePin:string;
  };
  
}

export interface DailyDeliveryWithCustomernDeliveryItems {
  id: number;
  date: Date;
  customer: {
    id: number;
    firstName: string;
  };
  deliveryItems: DeliveryItem[]; // Ensure this is an array
}

interface DeliveryItem {
  id: number;
  date: string;
  Qty: number;
  price: number;
  productId: number;
  dailyDeliveryId: number;
  product?: {
    name: string;
  };
}

export interface RouteASC
{
  customerId:number;
  index:number;

}



@Component({
  selector: 'app-daily-delivery',
  standalone:true,
  imports: [FormsModule,CommonModule, MatTableModule,MatDatepickerModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule, MatInputModule, 
    MatMenuModule,
    MatButtonModule,
    CdkDropList, CdkDrag,
    MatSnackBarModule,

  ],
  providers:[provideNativeDateAdapter()],
  templateUrl: './daily-delivery.component.html',
  styleUrl: './daily-delivery.component.css'
})
export class DailyDeliveryComponent implements OnInit{

 
// Table Configuration
displayedColumns: string[] = [

  'customerId',
  'date', 
  'customer', 
  'deliveryItems', 
  'actions'
];

routeOrder:Array<{customerId:number, index:number}>=[];

drop(event:CdkDragDrop<DailyDeliveryWithCustomernDeliveryItems[]>)
{
  const previousIndex = this.dataSource.data.findIndex(d=>d ===event.item.data);

  moveItemInArray(this.dataSource.data,previousIndex,event.currentIndex);
  
  this.dataSource.data=[...this.dataSource.data];

  

}

updateRouteOrder ()
{
  this.routeOrder=this.dataSource.data.map((delivery,index)=>({
    customerId:delivery.customer.id,
    index : index+1
  }))

  console.log('current route order : ',this.routeOrder);
}

confirmReorder()
{
  const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
    width:'350px',
    data:{
      title:'Confirm Reorder',
      message: 'Are you sure want to save this route order?'
    }
  });

  dialogRef.afterClosed().subscribe(result=>{
    if(result)
    {
      this.updateRouteOrder();
      this.submitRouteOrder();
    }
  })
}

submitRouteOrder()
{
  console.log("The route order before sending is : ",this.routeOrder)
    this.riderService.updateRouteOrder(this.routeOrder).subscribe({
     
      next:(response)=>{
        this.snackBar.open('Route order updated successfully!','close',{
          duration:3000
        });
       
      }
    })
}


  dailyDeliveries:DailyDeliveryWithCustomernDeliveryItems[]=[];

  ngOnInit(): void {
   

   

    this.onGetAssignedDailyDelveries();
  }

   // Date Filtering
   startDate!: Date|string ;
   endDate!: Date| string ;

  dataSource!: MatTableDataSource<DailyDeliveryWithCustomernDeliveryItems>;

  // Pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private riderService:RiderService, private tokenService:TokenService, private router:Router, private dialog: MatDialog, private snackBar:MatSnackBar){}

 // Optional: Add filtering
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

// New property for total bill
totalBill: number = 0;
  originalDeliveries: DailyDeliveryWithCustomernDeliveryItems[] = [];

  onGetAssignedDailyDelveries() {
    this.riderService.getDailyDelveriesWithItems().subscribe({
      next: (response: DailyDeliveryWithCustomernDeliveryItems[]) => {
        // Store original unfiltered deliveries
        this.originalDeliveries = response;
        this.dailyDeliveries = response;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;

        // Calculate initial total bill
        this.calculateTotalBill(response);
      }
    });
  }

  // Improved date filtering method
  applyDateFilter(): void {
    // Convert start and end dates to Date objects
    const startDate = this.startDate ? new Date(this.startDate) : '';
    const endDate = this.endDate ? new Date(this.endDate) : '';

    // If no dates selected, reset to original data
    if (!startDate && !endDate) {
      this.dataSource.data = this.originalDeliveries;
      this.calculateTotalBill(this.originalDeliveries);
      return;
    }

    // Filter deliveries based on date range
    const filteredDeliveries = this.originalDeliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      
      // If only start date is selected
      if (startDate && !endDate) {
        return deliveryDate >= startDate;
      }
      
      // If only end date is selected
      if (!startDate && endDate) {
        return deliveryDate <= endDate;
      }
      
      // If both dates are selected
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    // Update data source and calculate total bill
    this.dataSource.data = filteredDeliveries;
    this.calculateTotalBill(filteredDeliveries);
  }

  // Method to calculate total bill with robust error handling
  private calculateTotalBill(deliveries: DailyDeliveryWithCustomernDeliveryItems[]): void {
    try {
      // Check if deliveries exist
      if (!deliveries || deliveries.length === 0) {
        this.totalBill = 0;
        return;
      }
  
      // Calculate total bill in PKR
      this.totalBill = deliveries.reduce((total, delivery) => {
        // Safely handle deliveries without items
        if (!delivery.deliveryItems || delivery.deliveryItems.length === 0) {
          return total;
        }
  
        // Calculate delivery total in PKR
        const deliveryTotal = delivery.deliveryItems.reduce((subtotal, item) => {
          // Ensure Qty and price are numbers
          const qty = Number(item.Qty) || 0;
          const price = Number(item.price) || 0;
          
          // Calculate item total in PKR
          const itemTotal = qty * price;
          
          return subtotal + itemTotal;
        }, 0);
  
        return total + deliveryTotal;
      }, 0);
  
      // Format total bill for PKR
      console.log(`Total Bill in PKR: ${this.totalBill.toLocaleString()} PKR`);
    } catch (error) {
      console.error('Error calculating total bill:', error);
      this.totalBill = 0;
    }
  }

  // Reset method with full restoration
  resetDateFilter(): void {
    // Clear date inputs
    this.startDate = '';
    this.endDate = '';

    // Restore original data and recalculate total bill
    this.dataSource.data = this.originalDeliveries;
    this.calculateTotalBill(this.originalDeliveries);
  }

  // Method to navigate with daily delivery ID
  navigateToDeliveryItems(dailyDeliveryId:number) {
    this.router.navigate(['/riders/deliveryItem'], {
      state: { 
        dailyDeliveryId,
      }
    });
  }

 
}









