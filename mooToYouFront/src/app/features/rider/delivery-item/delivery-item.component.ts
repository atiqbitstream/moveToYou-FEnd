import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { RiderService } from '../services/rider.service';
import { response } from 'express';

export interface Product
{
  id:number
  name:string;
  organizationId:number;
}

export interface DeliveryItem
{
  Qty:number;
  price:number;
  productId:number;
  dailyDeliveryId:number;
}

@Component({
  selector: 'app-delivery-item',
  standalone:true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './delivery-item.component.html',
  styleUrl: './delivery-item.component.css'
})
export class DeliveryItemComponent implements OnInit {
  deliveryItemForm!: FormGroup;

  products:Product[]=[];

  dailyDeliveryId!:number;

  


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private riderService:RiderService,
   

  ) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state)
    {
      this.dailyDeliveryId=navigation.extras.state['dailyDeliveryId'];
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchAllProducts();
  }

  initForm(): void {
    this.deliveryItemForm = this.fb.group({
      productId: ['', Validators.required],
      Qty: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }


  fetchAllProducts()
  {
    this.riderService.getProducts().subscribe({
      next:(response)=>{
        this.products=response;
      }
    })
  }



  calculateTotal() {
    // // const quantity = this.deliveryItemForm.get('quantity').value || 0;
    // // const price = this.deliveryItemForm.get('price').value || 0;
    // return quantity * price;
  }

  onSubmit(): void {
    if (this.deliveryItemForm.valid) {
      const deliveryItem:DeliveryItem = {
        ...this.deliveryItemForm.value,
        dailyDeliveryId:this.dailyDeliveryId
      }

      const payload={
        dailyDeliveryId:this.dailyDeliveryId,
        deliveryItem
      }
      
       this.riderService.addDeliveryItems(deliveryItem).subscribe({
         next: (response) => {
           this.router.navigate(['/riders/assignedCustomers']);
         },
         error: (error) => {
          console.error(error)
         }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/riders/dailyDeliveries']);
  }
}
