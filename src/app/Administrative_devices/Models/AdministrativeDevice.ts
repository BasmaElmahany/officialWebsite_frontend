export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdministrativeDevice {
  id: string;
  nameAr: string;
  nameEn: string;
  serialNumber?: string;
  type?: string;
  status?: string;
  location?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  notes?: string;
  photoUrl?: string;
  activities?: any[];
  services?: any[];
}

// السطر ده هو اللي بسببه بتطلع أخطاء الـ List والـ Edit والـ Service
export interface AdministrativeDeviceRead extends AdministrativeDevice {}