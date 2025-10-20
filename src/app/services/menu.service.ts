import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menus`;

  constructor(private http: HttpClient) {}

  /** Gắn Bearer token để xác thực */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /** Lấy danh sách menu */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Lấy chi tiết menu theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Tạo menu mới (cần đăng nhập) */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getAuthHeaders());
  }

  /** Cập nhật menu (cần đăng nhập) */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  /** Xóa menu (cần đăng nhập) */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
  
}
