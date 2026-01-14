export interface Directorate {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
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
  activities?: DirectorateActivity[];
  services?: DirectorateService[];
  managerName?: {
    ar: string;
    en: string;
  };
}

export interface DirectorateRead {
  id: string;
  nameAr: string;
  nameEn: string;
  photoUrl?: string;
  dirPhotoUrl?: string;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email?: string;
  faxNumber?: string;
  link?: string;
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  activities?: DirectorateActivity[];
  services?: DirectorateService[];
}

export interface DirectorateActivity {
  activityAr: string;
  activityEn: string;
}

export interface DirectorateService {
  serviceAr: string;
  serviceEn: string;
  file?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateDirectorate {
  nameAr: string;
  nameEn: string;
}