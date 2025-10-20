import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /** Lấy tất cả category (có phân trang, tìm kiếm, sort, filter) */
  getAll(params: any = {}): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  /** Lấy category theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Tạo mới category */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Cập nhật category */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /** Xóa category */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
