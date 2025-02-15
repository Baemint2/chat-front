import {UserInfo} from "./userTypes";

export interface ChatRoom {
    chatRoomId: number;
    chatRoomTitle?: string;
    msgContent?: string;
    participantUsers: UserInfo[];
    latelyMessage?: string;
    unreadCount?: number | 0;
}

export interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string;
}