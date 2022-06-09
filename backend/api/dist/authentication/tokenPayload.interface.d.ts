interface Photo {
    value: string;
}
export interface TokenPayload {
    userId: string;
    photos: Photo[];
}
export {};
