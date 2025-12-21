import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseAPI } from '../../../Environment/env';
import { Company } from '../Models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = baseAPI + '/Company';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  createCompany(company: Company): Observable<any> {
    return this.http.post<any>(this.baseUrl, company);
  }

  updateCompany(company: Company): Observable<any> {
    // Assumes company.id is present and required by backend
    return this.http.put<any>(`${this.baseUrl}/${company.id}`, company);
  }

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}`);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
