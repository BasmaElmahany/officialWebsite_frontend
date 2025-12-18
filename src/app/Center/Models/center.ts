export interface Center {
    id: string ;
    nameAr : string ;
    nameEn : string ;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateCenter {
   nameAr : string ;
    nameEn : string ;
}