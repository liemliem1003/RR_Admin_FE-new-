import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // Lấy danh sách người dùng
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Lấy thông tin chi tiết 1 user theo ID
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Thêm người dùng mới
  create(userData:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  // Cập nhật người dùng
  update(id: number | string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  // Xóa người dùng
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Cập nhật trạng thái kích hoạt / khóa tài khoản
  toggleActive(id: number | string, active: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { active });
  }
}
