import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action = 'close', duration = 3000, panelClass:string[]=[]) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
    });
  }

  showSuccess(message:string):void{
    this.show(message,'close',3000,['success-snackbar'])
  }

  showError(message:string):void{
    this.show(message,'close',3000, ['error-snackbar'])
  }
}
