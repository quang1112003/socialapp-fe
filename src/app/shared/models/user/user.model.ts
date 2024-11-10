export interface User {
    id: string;
    email: string;
    knowAs: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
    age: number;
    lastActive: Date;
    cityName: string;
    stateName: string;
    countryName: string;
    introduction?: string;
    lookingFor?: string;
    interests?: string[];
    photos?: any[];
    roles?: string[];
    isPrivate?: boolean;
} 