export interface CultureCenter {
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
  activities?: CultureCenterActivity[];
  services?: CultureCenterService[];
  managerName?: {
    ar: string;
    en: string;
  };
}

export interface CultureCenterRead {
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
  activities?: CultureCenterActivity[];
  services?: CultureCenterService[];
}

export interface CultureCenterActivity {
  activityAr: string;
  activityEn: string;
}

export interface CultureCenterService {
  id: number;
  serviceAr: string;
  serviceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  fees: number;
  placeAr: string;
  placeEn: string;
  link: string;
  file: string;
  centerId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateCultureCenter {
  nameAr: string;
  nameEn: string;
}