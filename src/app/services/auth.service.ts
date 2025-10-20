// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { environment } from '../environments/environment';
// // import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/auth`;

//   constructor(
//     private http: HttpClient,
//     // private authService: AuthService
//   ) { }

//   register(name: string, email: string, password: string, phone: string, role: string = 'end_user'): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, role, phone });
//   }

//   login(email: string, password: string): Observable<{ user: any; token: string }> {
//     return this.http.post<{ user: any; token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(tap(res => {
//       this.saveToken(res.token);
//       console.log(res.user);
//       localStorage.setItem('role', res.user.role);
//     }));
//   }

//   changePassword(oldPassword: string, newPassword: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
//   }

//   // helper methods
//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   getRole(): string | null {
//     return localStorage.getItem('role');
//   }

//   saveToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   clearToken() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//   }
// }
