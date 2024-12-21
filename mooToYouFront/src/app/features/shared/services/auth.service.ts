import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ERole } from '../enums/roles.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_KEY = 'authData';

  constructor(private http: HttpClient) {}

  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  getUserRole(): ERole {
    if (!this.isLocalStorageAvailable()) {
      return ERole.DEFAULT;
    }

    const storedData = localStorage.getItem(this.AUTH_KEY);
    let userRole: ERole = ERole.DEFAULT;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData?.user?.role) {
        userRole = parsedData.user.role as ERole;
      }
    }

    return userRole;
  }
}
