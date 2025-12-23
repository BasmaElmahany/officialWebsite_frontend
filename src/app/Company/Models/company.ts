export interface Company {
  id: string;
  nameAr: string;
  nameEn: string;
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