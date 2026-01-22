export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UpperEgyptDevelopment {
  id: string;
  titleAr: string;
  titleEn: string;
  centerId?: string;
  fileUrl?: File;
}

export interface UpperEgyptDevelopmentRead {
  id: string;
  titleAr: string;
  titleEn: string;
  centerId?: string;
  fileUrl?: string;
}