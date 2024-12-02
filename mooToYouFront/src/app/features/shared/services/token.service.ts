import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'punycode';

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
  constructor(private http: HttpClient) {}

  private readonly AUTH_KEY = 'authData';

  setAuthData(authData:any):void
  {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
  }

  getAuthData():any|null
  {
    const authData = localStorage.getItem(this.AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  }

  getAccessToken(): string | null {
    const authData = this.getAuthData();
    return authData?.accessToken || null;
  }

  clearAuthData():void {
    localStorage.removeItem(this.AUTH_KEY);
  }
  
  logOut()
  {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    sessionStorage.clear();


  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    try{
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now()/1000);
      return decoded.exp> currentTime;
    }catch(error)
    {
      return false;
    }
  }

  geUserRole():string| null
  {
    const authData = this.getAuthData();
    return authData?.user?.role || null;
  }

  getUserId(): number| null
  {
    const authData = this.getAuthData();
    return authData?.user?.id || null;
  }
}
