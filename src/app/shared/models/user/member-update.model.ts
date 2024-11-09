export interface MemberUpdateDto {
    introduction: string;
    lookingFor: string;
    interests: number[];
    countryId: string;
    stateId: string;
    cityId: string;
    isPrivate: boolean;
}