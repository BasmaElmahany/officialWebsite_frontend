import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CultureCenter, CultureCenterRead } from '../Models/Center';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  private readonly apiUrl = 'https://shusha.minya.gov.eg:93/api/CultureCenters';

  constructor(private http: HttpClient) {}

  // 1. جلب كل المراكز
  getAllSocialSocieties(): Observable<CultureCenterRead[]> {
    return this.http.get<CultureCenterRead[]>(this.apiUrl);
  }

  // 2. جلب مركز واحد بالتفصيل (لحل خطأ Details)
  getById(id: string): Observable<CultureCenter> {
    return this.http.get<CultureCenter>(`${this.apiUrl}/${id}`);
  }

  // 3. إضافة مركز جديد (لحل خطأ Create)
  create(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 4. تعديل مركز (اختياري إذا كنتِ ستستخدمينه لاحقاً)
  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // 5. حذف مركز
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}