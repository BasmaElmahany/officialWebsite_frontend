export interface Video {
    Id: string;
    TitleAr: string;
    TitleEn: string;
    ArticleAr: string;
    ArticleEn: string;
    Date: Date;
    videoUrl: File;
}

export interface VideoRead {
    id: string;
    titleAr: string;
    titleEn: string;
    articleAr: string;
    articleEn: string;
    date: string;
    videoUrl: string;
}

