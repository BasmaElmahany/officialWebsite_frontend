export interface Agency {
  id: string;
  nameAr: string;
  nameEn: string;
  dirNameAr: string;
  dirNameEn: string;
  addressAr: string;
  addressEn: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email?: string;
  faxNumber?: string;
  link?: string;
  photoUrl?: string;
  dirPhotoUrl?: string;
  activities: AgencyActivity[];
  services: AgencyService[];
}

export interface AgencyRead {
  id: string;
  nameAr: string;
  nameEn: string;
  photoUrl?: string;
  dirPhotoUrl?: string;
  dirNameAr: string;
  dirNameEn: string;
  addressAr: string;
  addressEn: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email?: string;
  faxNumber?: string;
  link?: string;
  activities: AgencyActivity[];
  services: AgencyService[];
}

export interface AgencyActivity {
  activityAr: string;
  activityEn: string;
}

export interface AgencyService {
  serviceAr: string;
  serviceEn: string;
  file?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateAgency {
  nameAr: string;
  nameEn: string;
}