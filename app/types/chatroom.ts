import {UserInfo} from "./userinfo";

export interface ChatRoom {
    chatRoomId: number;
    chatRoomTitle?: string;
    msgContent?: string;
    participantUsers: UserInfo[];
    latelyMessage?: string;
    unreadCount?: number | 0;
}