

export interface Directorate {
    id: string ;
    nameAr : string ;
    nameEn : string ;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface CreateDirectorate {
   nameAr : string ;
    nameEn : string ;
}