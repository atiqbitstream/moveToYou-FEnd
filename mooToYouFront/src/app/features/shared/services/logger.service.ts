import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class loggerService {
  log(message: string, ...optionalParams: any[]) {
    if (!environment.production) {
      console.log(`[LOG] ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] ${message}`, ...optionalParams);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
  }
}
