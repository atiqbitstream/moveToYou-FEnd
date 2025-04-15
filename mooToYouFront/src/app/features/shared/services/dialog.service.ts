import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent, ConfirmationDialogData } from "../components/layout/confirmation-dialog/confirmation-dialog.component";
import { firstValueFrom } from "rxjs";

@Injectable({providedIn:'root'})


export class DialogService
{
   constructor(private dialog:MatDialog){}

   async confirm(data:ConfirmationDialogData): Promise<boolean>{
    const confirmed = await firstValueFrom(
        this.dialog.open(ConfirmationDialogComponent,{
            data,
            width:'400px'
        }).afterClosed()
    );
    return confirmed;
   }
}