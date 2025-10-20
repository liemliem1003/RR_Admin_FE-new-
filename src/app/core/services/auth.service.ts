import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Đăng nhập
   */
  login(email: string, password: string): Observable<any> {
    console.log("123123");
    const credentials = {
      email: email,
      password: password
    }
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(tap((res:any)=>{
      console.log(res);
      this.setToken(res.token)
      this.setUser(res.user)
    }));
  }

  /**
   * Đăng ký tài khoản
   */
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /**
   * Đăng xuất (xóa token trong localStorage)
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Lưu token khi login thành công
   */
  setToken(token: string): void {
    console.log(token);
    
    localStorage.setItem('token', token);
  }

  /**
   * Lấy token từ localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Lưu user info (role, name…) vào localStorage
   */
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Lấy user info từ localStorage
   */
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Lấy role hiện tại của user
   */
  getUserRole(): string | null {
    
    const user = this.getUser();
    console.log("user: ", user);

    return user?.role || null;
  }
}
