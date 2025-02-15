'use client'

import "../css/chat.css"
import write from "@/public/img/write.png"
import messageImg from "@/public/img/message.png"
import React, {useEffect, useState} from "react";
import ChatRoomList from "./components/chatroom/ChatRoomList";
import { UserInfo } from "../types/userTypes";
import CreateChatRoomModal from "./components/modal/CreateChatRoomModal";
import MidChat from "./components/MidChat";
import {useStomp} from "@/app/StompContext";
import {useBeforeUnload} from "react-router-dom";
import {getChatRoom, updateLastSeenDt} from "../api/chatRoom";
import {getUserInfo} from "../api/userInfo";
import Image from "next/image";

interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string
    unreadCount?: number | 0
    latelyMessage?: string
}

interface Unread {
    chatRoomId: number,
    serId: number,
    unreadCount: number | 0,
}

export default function Chat(){
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [chatRooms, setChatRooms] = useState<IChatRoomInfo[]>([]);
    const [chatRoomInfo, setChatRoomInfo] = useState<IChatRoomInfo>();
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { stompClient } = useStomp();

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true)
            const userInfo = await getUserInfo();

            if (userInfo) {
                setUserInfo(userInfo.second)
                const chatRoom = await getChatRoom(userInfo.second.username);
                setChatRooms(chatRoom);
            }

            setTimeout(() => {
                setIsLoading(false)
            }, 100)
        }
        fetchUserInfo();
    }, []);

    useEffect(() => {
        console.log("렌더링 후 chatRooms 상태:", chatRooms);
    }, [chatRooms]);

    useEffect(() => {
        if (currentChatRoomId) {
            const selectedRoom = chatRooms?.find((room) => room.chatRoomId === currentChatRoomId);
            setChatRoomInfo(selectedRoom);
        }
    }, [currentChatRoomId, chatRooms]);

    useEffect(() => {
        if (!stompClient || !stompClient.connected) return;


        const subscription = stompClient.subscribe(`/sub/chat/update/${userInfo?.username}`, (message) => {
            const updatedRoom = JSON.parse(message.body);
            setChatRooms(updatedRoom);
        });
        stompClient.publish({
            destination: "/pub/unread",
            body: JSON.stringify({ userId: userInfo?.id }),
        });

        const subscription2 = stompClient.subscribe(`/queue/unreadCount/${userInfo?.username}`, (message) => {
            const unreadCounts = JSON.parse(message.body);
            console.log(unreadCounts)

            setChatRooms((prevRooms) => {
                return prevRooms.map((room) => {
                    const unreadData = unreadCounts.find((unread: Unread) => unread.chatRoomId === room.chatRoomId);

                    if (unreadData) {
                        return { ...room, unreadCount: unreadData.unreadCount };
                    }
                    console.log(room)
                    return room;
                });
            });
        });

        return () => {
            subscription.unsubscribe();
            subscription2.unsubscribe();
        };
    }, [stompClient, stompClient?.connected]);

    useBeforeUnload(() => {
        if (currentChatRoomId !== null) {
            updateLastSeenDt(currentChatRoomId, userInfo?.id);
        }
    })

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    }

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    }

    return (
        <div>
            <div className="crispy-container">
                <div>
                    <main>
                        <div>
                            <div className="container message">
                                <div className="main">
                                    <div>
                                        <div className="box">

                                            <div className="left">

                                                <div className="request">
                                                    <a role="button" className="send-message" data-bs-toggle="modal"
                                                       data-bs-target="#createChatRoomModal">
                                                        <Image className="icon" src={write} alt="메시지 작성 아이콘"/>
                                                    </a>
                                                </div>

                                                <div>
                                                    <div>
                                                        <div className="msg-room-list" id="chatRoomList">
                                                            <ChatRoomList
                                                                chatRooms={chatRooms}
                                                                currentChatRoomId={currentChatRoomId}
                                                                setCurrentChatRoomId={setCurrentChatRoomId}
                                                                isLoading={isLoading}
                                                                userInfo={userInfo}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mid-intro"
                                                 style={{display: currentChatRoomId ? "none" : "flex"}}>
                                                <div className="intro">
                                                    <div>
                                                        <div className="circle"></div>
                                                        <Image src={messageImg} alt="메시지 아이콘"/>
                                                    </div>
                                                    <div>내 메시지</div>
                                                    <div>친구나 그룹에 사진과 메시지를 보내보세요.</div>
                                                    <button id="msg" onClick={openCreateModal} className="send-message">메시지 보내기</button>
                                                </div>
                                            </div>

                                            <CreateChatRoomModal isOpen={isCreateModalOpen}
                                                                 isClose={closeCreateModal}
                                                                 modalTitle="채팅방 생성"
                                                                 userInfo={userInfo!}/>


                                            <MidChat currentChatRoomId={currentChatRoomId}
                                                     setCurrentChatRoomId={setCurrentChatRoomId}
                                                     setChatRooms={setChatRooms}
                                                     chatRoomInfo={chatRoomInfo}
                                                     userInfo={userInfo!}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}