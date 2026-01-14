export interface socialSocieties {
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
  activities?: socialSocietiesActivity[];
  services?: socialSocietiesService[];
  managerName?: {
    ar: string;
    en: string;
  };
}

export interface socialSocietiesRead {
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
  activities?: socialSocietiesActivity[];
  services?: socialSocietiesService[];
}

export interface socialSocietiesActivity {
  activityAr: string;
  activityEn: string;
}

export interface socialSocietiesService {
  serviceAr: string;
  serviceEn: string;
  file?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateSocialSocieties {
  nameAr: string;
  nameEn: string;
}