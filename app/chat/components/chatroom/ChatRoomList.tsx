'use client'

import React, {useMemo} from "react";
import ChatRoomItem from "./ChatRoomItem";
import { ChatRoom } from "@/app/types/chatRoomTypes";
import {UserInfo} from "@/app/types/userTypes";

interface ChatRoomListProps {
    chatRooms: ChatRoom[],
    currentChatRoomId: number | null;
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
    isLoading: boolean
    userInfo?: UserInfo;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
                                                       chatRooms,
                                                       currentChatRoomId,
                                                       setCurrentChatRoomId,
                                                       isLoading,
                                                       userInfo
                                                   }) => {

    const renderedChatRooms = useMemo(() => (
        chatRooms?.map((room) => (
            <ChatRoomItem
                key={room.chatRoomId}
                chatRoom={room}
                currentChatRoomId={currentChatRoomId}
                setCurrentChatRoomId={setCurrentChatRoomId}
                userInfo={userInfo}
            />
        ))
    ), [chatRooms, currentChatRoomId]);

    return (
        <div>
            {/* ✅ 로딩 중일 때 표시할 UI */}
            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>채팅방 목록을 불러오는 중...</p>
                </div>
            ) : (
                chatRooms.length > 0 ? renderedChatRooms : <p>참여 중인 채팅방이 없습니다.</p>
            )}
        </div>
    );
};

export default ChatRoomList;
