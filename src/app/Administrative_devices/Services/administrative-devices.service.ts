import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// استيراد الـ ApiResponse والـ Interfaces الجديدة
import { AdministrativeDevice, AdministrativeDeviceRead, ApiResponse } from '../Models/AdministrativeDevice';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeDevicesService {
  private readonly apiUrl = 'https://shusha.minya.gov.eg:93/api/Administrative_devices';

  constructor(private http: HttpClient) {}

  // جلب الكل مع استخدام ApiResponse لضمان النوع
  getAll(): Observable<AdministrativeDeviceRead[]> {
    return this.http.get<ApiResponse<AdministrativeDeviceRead[]>>(this.apiUrl).pipe(
      map(res => res.data) // استخراج المصفوفة مباشرة من حقل data
    );
  }

  // جلب عنصر واحد بالـ ID
  getById(id: string): Observable<AdministrativeDevice> {
    return this.http.get<ApiResponse<AdministrativeDevice>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  // إضافة جهاز جديد (يدعم FormData لرفع الصور)
  create(data: FormData): Observable<ApiResponse<AdministrativeDevice>> {
    return this.http.post<ApiResponse<AdministrativeDevice>>(this.apiUrl, data);
  }

  // تحديث بيانات الجهاز
  update(id: string, data: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, data);
  }

  // حذف الجهاز
  delete(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}