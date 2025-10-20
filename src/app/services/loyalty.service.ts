import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  private apiUrl = `${environment.apiUrl}/loyalty`;

  constructor(private http: HttpClient) {}

  /** Tạo header có Bearer token để xác thực */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /** Lấy toàn bộ Loyalty */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  /** Lấy Loyalty theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  /** Tạo mới Loyalty */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getAuthHeaders());
  }

  /** Cập nhật Loyalty */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  /** Xóa Loyalty */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
