// Generic API response (matches ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Returned photo object
export interface GovTourPhoto {
  id: number;
  photoUrl: string;
  govtourID: string;
}

// GET model (what frontend receives)
export interface GetGovTours {
  id: string;
  date: string; // DateOnly comes as ISO string
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
  photos: GovTourPhoto[];
}

// CREATE / UPDATE model (what frontend sends)
export interface CreateGovTour {
  date: string;
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
  photos?: File[]; // multipart upload
}



/* This file contains TypeScript interfaces for the GovTours feature. */

