import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizationId: string;
    organization: string;
  };
}

@Injectable({ providedIn: 'root' })
export class TokenService {
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

  setAuthData(authData: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    }
  }

  getAuthData(): any | null {
    if (this.isLocalStorageAvailable()) {
      const authData = localStorage.getItem(this.AUTH_KEY);
      return authData ? JSON.parse(authData) : null;
    }
    return null;
  }

  getAccessToken(): string | null {
    const authData = this.getAuthData();
    return authData?.accessToken || null;
  }

  getStoredOrgId(): string | null {
    const authData = this.getAuthData();
    return authData?.user?.organizationId || null;
  }

  clearAuthData(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.AUTH_KEY);
    }
  }

  logOut(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.AUTH_KEY);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
    }
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return true;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true; // Assume expired if decoding fails
    }
  }

  geUserRole(): string | null {
    const authData = this.getAuthData();
    return authData?.user?.role || null;
  }

  getUserId(): number | null {
    const authData = this.getAuthData();
    return authData?.user?.id || null;
  }
}
