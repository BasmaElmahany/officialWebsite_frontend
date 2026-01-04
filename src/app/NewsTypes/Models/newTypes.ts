export interface NewsTypes {
    id: string;
    nameAr: string;
    nameEn: string;
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


export interface CreateType {
    nameAr: string;
    nameEn: string;
}