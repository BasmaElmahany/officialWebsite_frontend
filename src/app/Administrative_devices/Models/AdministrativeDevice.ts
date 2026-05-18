export interface AdministrativeDeviceService {
  id: number;
  deviceId: string;
  serviceAr: string;
  serviceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  fees: number;
  placeAr: string;
  placeEn: string;
  link: string;
  file: string;
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
  services?: AdministrativeDeviceService[]; // الربط هنا
}

export interface AdministrativeDeviceRead extends AdministrativeDevice {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}