import { Photo } from './photo.model';
import { User } from './user.model';

export enum PostStatus {
    PUBLIC = 'PUBLIC',
    FRIENDS = 'FRIENDS',
    PRIVATE = 'PRIVATE'
}

export interface PostResponse {
    id: number;
    content: string;
    status?: PostStatus | string;
    createdAt: Date;
    updatedAt: Date;
    photos: Photo[];
    user: User;
}