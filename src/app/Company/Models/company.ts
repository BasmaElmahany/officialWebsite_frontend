// --- ملف الموديل (Models) فقط لتعريف شكل البيانات ---

export interface Activity {
  activityAr: string;
  activityEn: string;
}

export interface Service {
  serviceAr: string;
  serviceEn: string;
  file?: string; // Added optional file property to match usage in company-edit.component.ts
  fileUrl?: string; // Added optional fileUrl property to match usage in company-details.component.html
}

export interface File {
  fileUrl: string;
  fileNameAr: string;
  fileNameEn: string;
}

export interface CompanyRead {
  id: string;
  nameAr: string;
  nameEn: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  email?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  faxNumber?: string;
  link?: string;
  photoUrl?: string;
  dirPhotoUrl?: string;
  activities?: Activity[];
  services?: Service[];
  files?: File[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateCompany {
  nameAr: string;
  nameEn: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  email?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  faxNumber?: string;
  link?: string;
}

export interface Company {
  id: string;
  nameAr: string;
  nameEn: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  email?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  faxNumber?: string;
  link?: string;
}