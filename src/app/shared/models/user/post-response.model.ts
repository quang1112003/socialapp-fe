import { Photo } from "./photo.model";

export interface PostResponse {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    photos: Photo[];
    appUserId: string;
}

export interface User {
    id: any;
    firstName: string;
    lastName: string;
}