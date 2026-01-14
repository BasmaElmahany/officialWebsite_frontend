import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Agency } from '../../Pages/Agencies/Models/Agencies';

@Injectable({
  providedIn: 'root'
})
export class AgenciesService {
  private apiUrl = 'https://shusha.minya.gov.eg:93/api/Government_Agency';

  constructor(private http: HttpClient) {}

  getAgencies(): Observable<Agency[]> {
    return this.http.get<{ data: Agency[] }>(this.apiUrl).pipe(
      map(response => response.data || []) // Extract the 'data' property or return an empty array
    );
  }

  getAgencyById(id: string): Observable<Agency> {
    return this.http.get<Agency>(`${this.apiUrl}/${id}`);
  }
}