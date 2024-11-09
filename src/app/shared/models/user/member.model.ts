import { Interest } from "./interest.model";
import { Photo } from "./photo.model"

export interface Member {
    id: any;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: Date;
    lastActive: Date;
    age: number;
    photoUrl: string;
    knowAs: string;
    gender: string;
    isPrivate: boolean;
    introduction: string;
    interests: Interest[];
    lookingFor: string;
    countryName: string;
    stateName: string;
    cityName: string;
    countryId: number;
    stateId: number;
    cityId: number;
    photos: Photo[];
}

