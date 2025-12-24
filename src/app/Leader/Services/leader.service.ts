
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leader } from '../Models/leader';
import { LeaderCreateRequest } from './leader-create-request.model';
import { baseAPI } from '../../../Environment/env';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {
    deleteLeader(id: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
  private apiUrl = `${baseAPI}/Leaders`;

  constructor(private http: HttpClient) {}

  getLeaders(): Observable<{ msg: string; data: Leader[] }> {
    return this.http.get<{ msg: string; data: Leader[] }>(this.apiUrl);
  }

  getLeaderById(id: string): Observable<Leader> {
    return this.http.get<Leader>(`${this.apiUrl}/${id}`);
  }

  createLeader(data: LeaderCreateRequest): Observable<any> {
    const formData = new FormData();
    if (data.id) formData.append('Id', data.id);
    formData.append('NameAr', data.nameAr);
    formData.append('NameEn', data.nameEn);
    formData.append('CvDataAr', data.cvDataAr);
    formData.append('CvDataEn', data.cvDataEn);
    formData.append('PositionAr', data.positionAr);
    formData.append('PositionEn', data.positionEn);
    formData.append('StartDate', data.startDate);
    formData.append('EndDate', data.endDate);
    if (data.photoUrl) formData.append('photoUrl', data.photoUrl);
    formData.append('IsEnded', String(data.isEnded));

    return this.http.post<any>(this.apiUrl, formData);
  }

  updateLeader(id: string, data: LeaderCreateRequest): Observable<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('NameAr', data.nameAr);
    formData.append('NameEn', data.nameEn);
    formData.append('CvDataAr', data.cvDataAr);
    formData.append('CvDataEn', data.cvDataEn);
    formData.append('PositionAr', data.positionAr);
    formData.append('PositionEn', data.positionEn);
    formData.append('StartDate', data.startDate);
    formData.append('EndDate', data.endDate);
    if (data.photoUrl) formData.append('photoUrl', data.photoUrl);
    formData.append('IsEnded', String(data.isEnded));
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }
}
