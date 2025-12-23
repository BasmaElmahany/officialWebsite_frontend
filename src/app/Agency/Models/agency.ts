export interface Agency {
    id: string ;
    nameAr : string ;
    nameEn : string ;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateAgency{
   nameAr : string ;
    nameEn : string ;
}