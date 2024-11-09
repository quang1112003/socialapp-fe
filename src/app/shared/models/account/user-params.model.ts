import { User } from "./user.model";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 12;
    orderBy = 'dateCreated';
    searchTerm = '';

    constructor(user: User | null) {
        this.gender = user?.gender === 'female' ? 'male' : 'female'
    }
}