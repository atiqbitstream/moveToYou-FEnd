import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService<T> {
  constructor(private http: HttpClient) {}

  getAll(endpoint: string, params?: any): Observable<T[]> {
    const options = {
      params: this.buildHttpParams(params),
    };

    return this.http.get<T[]>(`${environment.apiUrl}/${endpoint}`, options);
  }

  getById(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${endpoint}/${id}`);
  }

  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${endpoint}`, data);
  }

  update(endpoint: string, id: number | string, data: T): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number | string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}/${endpoint}/${id}`);
  }

  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] != null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return httpParams;
  }
}
