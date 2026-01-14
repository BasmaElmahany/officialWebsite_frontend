export interface Agency {
  id: string;
  nameAr: string;
  nameEn: string;
  photoUrl: string;
  dirphotoUrl?: string | null;
  dirNameAr?: string | null;
  dirNameEn?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  phoneNumber1?: string | null;
  phoneNumber2?: string | null;
  email?: string | null;
  faxNumber?: string | null;
  link?: string | null;
  activities: string[];
  services: string[];
}