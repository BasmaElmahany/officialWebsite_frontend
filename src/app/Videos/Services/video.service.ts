import { Injectable } from '@angular/core';
import { baseAPI } from '../../../Environment/env';
import { HttpClient } from '@angular/common/http';
import { Video, VideoRead } from '../Models/video';
import { ApiResponse } from '../../Center/Models/center';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private readonly apiUrl = `${baseAPI}/RecentVideo`;
 
   constructor(private http: HttpClient) { }
   getAllVideos() {
     return this.http
       .get<ApiResponse<VideoRead[]>>(this.apiUrl)
       .pipe(map(res => res.data));
   }
 
   getbyId(id: string) {
     return this.http
       .get<ApiResponse<VideoRead>>(`${this.apiUrl}/${id}`)
       .pipe(map(res => res.data));
   }
 
   createVideo(formData: FormData): Observable<Video> {
     return this.http
       .post<ApiResponse<Video>>(this.apiUrl, formData)
       .pipe(map(res => res.data));
   }
   /* =============================
      UPDATE
      API expects: PUT /Centers/{id}
   ============================== */
   updateVideo(
     id: string,
     formData: FormData
   ): Observable<Video> {
     return this.http
       .put<ApiResponse<Video>>(`${this.apiUrl}/${id}`, formData)
       .pipe(map(res => res.data));
   }
 
   /* =============================
      DELETE
      API returns: data: true
   ============================== */
   deleteVideo(id: string): Observable<boolean> {
     return this.http
       .delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`)
       .pipe(map(res => res.data));
   }
}
