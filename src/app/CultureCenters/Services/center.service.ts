import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // تم تصحيح المسار هنا
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CultureCenter, CultureCenterRead } from '../Models/Center';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  private readonly apiUrl = 'https://shusha.minya.gov.eg:93/api/CultureCenters';

  constructor(private http: HttpClient) {}


  getAllCultureCenters(): Observable<CultureCenterRead[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data as CultureCenterRead[])
    );
  }

  getById(id: string): Observable<CultureCenter> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data as CultureCenter)
    );
  }

  create(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}