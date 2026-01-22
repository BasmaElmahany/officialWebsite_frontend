// Generic API response (matches ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Returned photo object
export interface NewsPhoto {
  id: number;
  photoUrl: string;
  newsId: string;
}

// GET model (what frontend receives)
export interface GetNews {
  id: string;
  typeId: number;
  date: string; // DateOnly comes as ISO string
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
  sourceAr?: string;
  sourceEn?: string;
  photos: NewsPhoto[];
}

// CREATE / UPDATE model (what frontend sends)
export interface CreateNews {
  typeId: number;
  date: Date;
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
  sourceAr?: string;
  sourceEn?: string;
  photos?: File[]; // multipart upload
}



/* This file contains TypeScript interfaces for the GovTours feature. */

