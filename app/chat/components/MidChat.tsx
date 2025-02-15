'use client'

import anonymous from "@/public/img/anonymous.png";
import menu from "@/public/img/menu.png";
import MessageItem from "./MessageItem";
import messageImg from "@/public/img/message.png";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import question from "@/public/img/question.png";
import { UserInfo } from "@/app/types/userTypes";
import { Message } from "@/app/types/msgTypes";
import InviteModal from "./modal/InviteModal";
import {useStomp} from "@/app/StompContext";
import {getChatMessages, leaveChatRoom} from "@/app/api/chatRoom";
import Image from "next/image";

interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string
}

interface MidChatProps {
    currentChatRoomId: number | null
    chatRoomInfo?: IChatRoomInfo
    userInfo: UserInfo
    setCurrentChatRoomId: (chatRoomId: number | null) => void,
    setChatRooms: React.Dispatch<React.SetStateAction<IChatRoomInfo[]>>
}

const MidChat: React.FC<MidChatProps> = ({currentChatRoomId, chatRoomInfo, userInfo, setCurrentChatRoomId, setChatRooms}) => {
    const { stompClient, isConnected } = useStomp();
    const rightSidebarRef = useRef<HTMLDivElement>(null);
    const midChatRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
    const [isLeaving, setIsLeaving] = useState<boolean>(false)

    useEffect(() => {
        if (!stompClient || !isConnected || !currentChatRoomId) return;

        const subscription = stompClient.subscribe(
            `/sub/chat/room/${currentChatRoomId}`,
            (message) => {
                const receivedMessage = JSON.parse(message.body);
                const newMessage = { ...receivedMessage, msgDt: new Date().toISOString() };
                console.log(newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, isConnected, currentChatRoomId]);

    const deleteMessage = () => {
        console.log("메시지 삭제")
    }

    useEffect(() => {
        if (currentChatRoomId === null) {
            toggleSideBar();
        } else {
            const fetchMessages = async () => {
                const chatMessages = await getChatMessages(currentChatRoomId, 0);
                setMessages(chatMessages);
            };

            if (currentChatRoomId && userInfo?.id) {
                fetchMessages();
            }
        }
    }, [currentChatRoomId]);

    useEffect(() => {

    }, []);

    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            requestAnimationFrame(() => {
                chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
            });
        }
    }, [currentChatRoomId, messages]);


    const handleLeaveRoom = async () => {
        if (!currentChatRoomId) return;

        setIsLeaving(true);

        leaveChatRoom(currentChatRoomId, userInfo?.id);

        setChatRooms((prevRooms) => prevRooms.filter(room => room.chatRoomId !== currentChatRoomId));

        setIsLeaving(false);
        setCurrentChatRoomId(null); // 선택된 채팅방 해제
    };

    const toggleSideBar = () => {

        if (!rightSidebarRef.current || !midChatRef.current) return;

        if (rightSidebarRef.current.style.display === "none" || rightSidebarRef.current.style.display === "") {
            rightSidebarRef.current.style.display = "flex";
            midChatRef.current.style.flexGrow = "0";
        } else {
            rightSidebarRef.current.style.display = "none";
            midChatRef.current.style.flexGrow = "1";
        }

        if(currentChatRoomId === null) {
            rightSidebarRef.current.style.display = "none";
            midChatRef.current.style.flexGrow = "1";
        }
    }

    const sendMessage = () => {
        console.log("메시지 전송");
        if (stompClient?.connected) {

            const newMsg = {
                userId: userInfo.id,
                creator: userInfo.username || "Unknown",
                msgContent: message,
                chatRoomId: currentChatRoomId!,
            };
            stompClient.publish({
                destination: "/pub/chat/message",
                body: JSON.stringify(newMsg),
            });

            setMessage("");

        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            if (event.nativeEvent.isComposing) {
                return; // IME 입력 중이면 전송하지 않음
            }

            if (event.metaKey) {
                return;
            }

            event.preventDefault();
            sendMessage(); // 메시지 전송
        }
    }

    const join = () => {
        return chatRoomInfo?.participantUsers.map(user => user.nickname).join(", ");
    }

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    }

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
    }


    return (
        <>
            <div className="mid-chat" ref={midChatRef}
                 style={{display: currentChatRoomId ? "flex" : "none"}}>
                <div className="chat-name">
                    <div className="profile-image">
                        <div><Image src={anonymous} alt="프로필 사진"/></div>
                    </div>
                    <div id="chatName" className="w-56">{chatRoomInfo?.chatRoomTitle ? chatRoomInfo.chatRoomTitle : join() }</div>
                    <div>검색</div>
                    <div>
                        <a role="button" id="toggleSidebar" onClick={toggleSideBar}>
                            <Image src={menu} alt={"menu"}/></a>
                    </div>
                </div>
                <div className="chat-window">
                    <div id="chatMessages" ref={chatContainerRef}>
                        {messages.map((msg: Message) => (
                            <MessageItem key={msg.msgId} msg={msg} currentUserId={userInfo?.id}
                                         deleteMessage={deleteMessage}/>
                        ))}
                    </div>
                    <div className="input">
                        <div>
                            <form method="post">
                            <textarea name="chat" id="chatInput" rows={1}
                                      value={message}
                                      onKeyDown={handleKeyDown}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="메시지 입력..."
                            ></textarea>
                            </form>
                            <div>
                                <Image className="icon"
                                     src={messageImg}
                                     alt="보내기 아이콘"
                                     onClick={sendMessage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-intro" id="rightSidebar" ref={rightSidebarRef}>
                <div className="intro">
                    <div className="chat-side-bar">대화하는 유저 목록</div>
                    <div className="side-bar-img-wrap">
                        <div className="profile-image">
                            <button className="send-message"
                                    onClick={openInviteModal}>
                                <div><Image src={question} alt="물음표"/></div>
                                <span >새로운 사용자 초대</span>
                            </button>
                        </div>
                    </div>
                    <InviteModal isOpen={isInviteModalOpen}
                                 isClose={closeInviteModal}
                                 modalTitle="사용자 초대"
                                 chatRoomInfo={chatRoomInfo}
                    />
                    <hr/>
                    <div className="w-full flex flex-col pl-5">
                        {(
                            chatRoomInfo?.participantUsers.map((user) => (
                                <div key={user.nickname} className="flex flex-row items-center mt-5">
                                    <Image src={user.profile ? user.profile : anonymous} alt={'프로필'}
                                         className=""
                                    />
                                    <div className="ml-8 text-3xl">{user.nickname}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="chat-room-wrap">
                    <div className="intro">
                        <div>
                            <div className={`chat-room-item ${isLeaving ? "fade-out" : ""}`} id="leave-room" onClick={handleLeaveRoom}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                나가기
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MidChat