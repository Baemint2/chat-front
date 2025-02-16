'use client'

import React from "react";
import {ChatRoom} from "@/app/types/chatroom";
import Anonymous from "@/public/img/anonymous.png";
import {UserInfo} from "@/app/types/userinfo";
import {updateLastSeenDt} from "@/app/api/chatRoom";
import Image from "next/image";

interface ChatRoomProps {
    chatRoom: ChatRoom;
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void;
    userInfo?: UserInfo;
}

const ChatRoomItem: React.FC<ChatRoomProps> = ({
                                                   chatRoom,
                                                   currentChatRoomId,
                                                   setCurrentChatRoomId,
                                                   userInfo
                                               }) => {

    const handleClick = () => {
        if (currentChatRoomId === chatRoom.chatRoomId) {
            updateLastSeenDt(currentChatRoomId, userInfo?.username)
            setCurrentChatRoomId(null);
        } else {
            if (currentChatRoomId !== null) {
                updateLastSeenDt(currentChatRoomId, userInfo?.username)
            }
            chatRoom.unreadCount = 0;
            setCurrentChatRoomId(chatRoom.chatRoomId);
        }
    };

    const join = () => {
        return chatRoom.participantUsers.map(user => user.nickname).join(", ");
    }

    return (
        <div
            className={`msg-room ${currentChatRoomId === chatRoom.chatRoomId ? "active" : ""}`}
            data-chat-id={chatRoom.chatRoomId}
            onClick={handleClick}
        >
            {/* 프로필 이미지 */}
            <div className="profile-image">
                <div>
                    <Image src={Anonymous} alt="Profile" />
                </div>
            </div>

            {/* 채팅방 정보 */}
            <div className="side-chat-room">
                <div>{chatRoom.chatRoomTitle ? chatRoom.chatRoomTitle : join()}</div>
                <div className="latest-message">
                    {chatRoom.latelyMessage ? chatRoom.latelyMessage.replace(/\n/g, "<br>") : "첫 메시지를 보내보세요!"}
                </div>
            </div>

            {/* 안 읽은 메시지 카운트 */}
            <div className="unread-count-badge"
                 style={{display: chatRoom.unreadCount === 0 || chatRoom.unreadCount === null ? "none" : "flex"}}
            >{chatRoom.unreadCount}</div>
        </div>
    );
};

export default ChatRoomItem;
