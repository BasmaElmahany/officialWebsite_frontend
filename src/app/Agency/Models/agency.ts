// 1. الموديلات الفرعية
export interface AgencyActivity {
  activityAr: string;
  activityEn: string;
}

export interface AgencyService {
  id?: number;
  agencyId?: string;
  serviceAr: string;
  serviceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  fees: number;
  placeAr: string;
  placeEn: string;
  link: string;
  file: string | File;
}

// 2. موديل القراءة (اللي بيرجع من الـ API)
export interface AgencyRead {
  id: string;
  nameAr: string;
  nameEn: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email?: string;
  faxNumber?: string;
  link?: string;
  photoUrl?: string; 
  dirPhotoUrl?: string;
  activities?: AgencyActivity[];
  services?: AgencyService[];
}

/** 
 * حلينا المشكلة هنا: 
 * بنعمل Export لـ Agency كأنها AgencyRead 
 * عشان الـ Components اللي بتعمل import { Agency } ما تضربش
 */
export type Agency = AgencyRead; 

// 3. موديل الإنشاء/التعديل (المتوافق مع Swagger Multipart)
export interface CreateAgency {
  id?: string;
  nameAr: string;
  nameEn: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email?: string;
  faxNumber?: string;
  link?: string;
  photoUrl?: File; // لاستقبال الملفات في الـ Form
  dirPhotoUrl?: File;
  activities?: AgencyActivity[];
  services?: AgencyService[];
}

// 4. الرد الموحد
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}