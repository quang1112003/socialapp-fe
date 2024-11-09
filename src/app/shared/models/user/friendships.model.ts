export interface Friendships {
    id: any;
    otherUserKnowAs: string;
    otherUserPhotoUrl: string;
    otherUserEmail: string;
    status: FriendshipStatus;
    createdAt: Date;
    userId: string;
    friendId: string;
}

export enum FriendshipStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    UNFRIENDED = "UNFRIENDED",
}