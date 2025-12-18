
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role } from '../Models/role';
import { baseAPI } from '../../../Environment/env';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${baseAPI}/Auth/roles`).pipe(
      catchError((error) => {
        console.error('Roles API error:', error);
        return of([]);
      })
    );
  }

  register(data: { fullName: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${baseAPI}/Auth/register`, data);
  }
}
