import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private apiUrl = `${environment.apiUrl}/vouchers`;

  constructor(private http: HttpClient) {}

  /** 🟩 Lấy danh sách tất cả voucher */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 🟦 Lấy chi tiết voucher theo ID */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** 🟢 Tạo mới voucher (có thể yêu cầu đăng nhập) */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** 🟡 Cập nhật voucher theo ID */
  update(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /** 🔴 Xóa voucher theo ID */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
