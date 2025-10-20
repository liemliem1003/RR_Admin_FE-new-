import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  private apiUrl = `${environment.apiUrl}/menu-items`;

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

  /** Lấy toàn bộ MenuItem theo menu */
  getByMenu(menuId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menu/${menuId}`, this.getAuthHeaders());
  }

  /** Lấy MenuItem theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  /** Tạo mới MenuItem (thêm product vào menu) */
  addProductToMenu(product:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, this.getAuthHeaders());
  }

  /** Cập nhật MenuItem */
  updateMenuItem(id: number | string, data: any): Observable<any> {
    console.log(data);
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  /** Xóa MenuItem */
  deleteMenuItem(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
