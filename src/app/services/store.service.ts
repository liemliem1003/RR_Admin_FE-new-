import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  /** Thêm token xác thực vào header */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /** Lấy toàn bộ cửa hàng */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Lấy chi tiết cửa hàng theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Tạo cửa hàng mới (yêu cầu đăng nhập) */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getAuthHeaders());
  }

  /** Cập nhật cửa hàng (yêu cầu đăng nhập) */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  /** Xóa cửa hàng (yêu cầu đăng nhập) */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  /** Lấy danh sách cửa hàng theo chủ sở hữu (nếu backend hỗ trợ) */
  getByOwner(userId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?owner=${userId}`, this.getAuthHeaders());
  }

  /** Tìm kiếm cửa hàng theo tên hoặc mã */
  search(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?search=${keyword}`);
  }
}
