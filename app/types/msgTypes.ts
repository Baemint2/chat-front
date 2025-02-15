export interface Message {
    msgId: number;
    userId: number;
    creator?: string;
    empProfile?: string;
    msgContent: string;
    msgDt: string;
    msgStat: number | 1;
    chatRoomNo: number;
}

/*
chatRoomNo: 48
msgContent: "123"
msgDt: "2025-02-08T21:20:44.017726"
msgId: 16
msgStat: 0
userId: 17
* */