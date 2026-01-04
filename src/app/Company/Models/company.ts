export interface Company {
  id: string;
  nameAr: string;
  nameEn: string;
  photoUrl?: string | null;
  dirPhotoUrl?: string | null;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  phoneNumber1?: string | null;
  phoneNumber2?: string | null;
  email?: string | null;
  faxNumber?: string | null;
  link?: string | null;
  activities: any[];
  services: any[];
}



export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateCompany {
   nameAr : string ;
    nameEn : string ;
}

export interface CompanyRead {
  id: string;
  nameAr: string;
  nameEn: string;
  photoUrl?: string | null;
  dirPhotoUrl?: string | null;
  dirNameAr?: string;
  dirNameEn?: string;
  addressAr?: string;
  addressEn?: string;
  phoneNumber1?: string | null;
  phoneNumber2?: string | null;
  email?: string | null;
  faxNumber?: string | null;
  link?: string | null;
  activities: any[];
  services: any[];
}