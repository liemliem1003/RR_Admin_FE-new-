import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /** Thêm token vào header cho API cần xác thực */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /** Lấy tất cả sản phẩm */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** Lấy sản phẩm theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Tạo sản phẩm mới (cần đăng nhập) */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, this.getAuthHeaders());
  }

  /** Cập nhật sản phẩm (cần đăng nhập) */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  /** Xóa sản phẩm (cần đăng nhập) */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  /** Lấy sản phẩm theo category (nếu backend có filter) */
  getByCategory(categoryId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?category=${categoryId}`);
  }

  /** Tìm kiếm sản phẩm theo tên */
  search(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?search=${keyword}`);
  }
}
