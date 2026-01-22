// ================= ROOT =================
export interface Center {
  id: string;
  nameAr: string;
  nameEn: string;
  aboutAr: string;
  aboutEn: string;
  populationNumber: number;
  dirNameAr: string;
  dirNameEn: string;
  dirPositionAr: string;
  dirPositionEn: string;
  phoneNumber: string;
  faxNumber: string;
  mapLink: string,

  investmentFactors?: InvestmentFactor[];
  villages?: Village[];
}


export interface CenterList {
  id: string;
  nameAr: string;
  nameEn: string;
}

// ================= CREATE =================
export interface CreateCenter {
  nameAr: string;
  nameEn: string;

  aboutAr?: string;
  aboutEn?: string;

  populationNumber?: number;

  investmentFactors?: CreateInvestmentFactor[];
  villages?: CreateVillage[];
}

// ================= INVESTMENT =================
export interface InvestmentFactor {
  id: number;
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
}

export interface CreateInvestmentFactor {
  titleAr: string;
  titleEn: string;
  articleAr: string;
  articleEn: string;
}

// ================= VILLAGES =================
export interface Village {
  id: string;
  nameAr: string;
  nameEn: string;
  miniVillages?: MiniVillage[];
}

export interface CreateVillage {
  nameAr: string;
  nameEn: string;
  miniVillages?: CreateMiniVillage[];
}

// ================= MINI =================
export interface MiniVillage {
  id: string;
  nameAr: string;
  nameEn: string;
  settlements?: Settlement[];
}

export interface CreateMiniVillage {
  nameAr: string;
  nameEn: string;
  settlements?: CreateSettlement[];
}

// ================= SETTLEMENT =================
export interface Settlement {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface CreateSettlement {
  nameAr: string;
  nameEn: string;
}

// ================= API =================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}