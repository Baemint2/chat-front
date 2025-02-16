export interface Message {
    msgId: number;
    userId: number;
    empProfile?: string;
    msgContent: string;
    msgDt: string;
    msgStat: string | 'ENABLED';
    chatRoomNo: number;
}