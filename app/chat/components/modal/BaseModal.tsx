'use client'

import React, {useEffect, useState} from "react";
import anonymous from "@/public/img/anonymous.png";
import {UserInfo} from '@/app/types/userTypes';
import Image from "next/image";

interface IUser {
    username: string;
    profile?: string;
    nickname: string;
}


interface IChatRoomInfo {
    chatRoomId: number;
    chatRoomTitle?: string;
    createdAt: string;
    creator: string;
    participantUsers: UserInfo[]
    updatedAt?: string
}

interface BaseModalProps {
    isOpen: boolean,
    isClose: () => void
    modalTitle: string,
    chatRoomInfo?: IChatRoomInfo,
    userInfo?: UserInfo,
}
const BaseModal: React.FC<BaseModalProps> = ({
                                                 isOpen,
                                                 isClose,
                                                 modalTitle,
                                                 chatRoomInfo,
                                                 userInfo}) => {
    const [users, setUsers] = useState<IUser[]>([]);   // 사용자 목록
    const [modalType, setModalType] = useState<string>()
    const [inviteUsers, setInviteUsers] = useState<Set<string>>(new Set())
    const [inviteUserInput, setInviteUserInput] = useState<string>("")

    useEffect(() => {
        if (inviteUserInput.trim()) {
            searchUsers(inviteUserInput);
        }
    }, [inviteUserInput]);

    useEffect(() => {
    }, [inviteUsers]);

    useEffect(() => {
    }, [users]);

    useEffect(() => {
        if(modalTitle === '사용자 초대') {
            setModalType("invite")
        } else {
            setModalType("create")
        }
    }, [isOpen, modalTitle]);

    useEffect(() => {
        if (isOpen) {
            getUsers(modalType);
            setInviteUserInput("");  // 🔹 모달 열릴 때도 초기화
        } else {
            setInviteUsers(new Set());
            setInviteUserInput("");  // 🔹 모달 닫힐 때도 초기화
        }
    }, [isOpen]);

    const searchUsers = async (nickname: string) => {
        const response = await fetch(`http://localhost:8090/users/search/${nickname}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

            }
        });
        const data = await response.json();
        console.log(data);
        setUsers(data)
    }

    const getUsers = (modalType?: string) => {

        console.log(modalType);

        if(modalType === 'invite') {
            fetch(`http://localhost:8090/users/exclude/${chatRoomInfo?.chatRoomId}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setUsers(data.users);
                })
        } else {
            fetch("http://localhost:8090/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data.users)
                    setUsers(data.users);
                })
                .catch((error) => {
                    console.error("유저 불러오기 오류:", error);
                });
        }
    };

    const inviteChatRoom = () => {
        console.log("유저초대")
    }

    const createChatRoom = async () => {
        const getCookie = (name: string) => {
            const cookies = document.cookie.split("; ");
            for (const cookie of cookies) {
                const [key, value] = cookie.split("=");
                if (key === name) return value;
            }
            return null;
        };

        const username = getCookie("username");

        const body = {
            creator: username,
            usernameList: [userInfo?.nickname, ...inviteUsers],
        }

        const response = await fetch(`http://localhost:8090/chat-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        await response.json();
        window.location.reload();
    }

    const handleInvite = (user: string) => {
        setInviteUsers(prevSet  => {
            const newSet = new Set(prevSet);
            newSet.delete(user);
            return newSet;
        })
        setInviteUserInput("");
    }

    return (
        <div
            className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            style={{display: isOpen ? "flex" : "none"}}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                    {/* 모달 헤더 */}
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-xl font-semibold">{modalTitle}</h3>
                        <button onClick={isClose}
                                className="gtext-gray-400 bg-transparent
                                hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap={"round"}
                                      strokeLinejoin={"round"} strokeWidth={"2"}
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    {/* 모달 내용 */}
                    <div className="mt-4">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow-sm dark:bg-white text-2xl">
                                <div className="p-4 md:p-5 space-y-4">
                                    <div id="selectedUserList"
                                         className="p-3 flex flex-wrap gap-2">
                                        {[...inviteUsers].map((user) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <div className="border p-3 flex flex-row justify-between items-center rounded-xl h-14 w-50">
                                                <span className="text-2xl mr-5">{user}</span>
                                                <button className="end" onClick={() => handleInvite(user)}>x</button>
                                            </div>
                                        ))}
                                    </div>
                                    <form id="invite-form"
                                          onSubmit={e => e.preventDefault()}
                                    >
                                        <div className="mb-3 flex flex-col text-2xl mt-4">
                                            <input type="text"
                                                   className="form-control mt-2 rounded-xl"
                                                   id="create-inviteUser"
                                                   onChange={(e) => setInviteUserInput(e.target.value)}
                                                   value={inviteUserInput}
                                                   placeholder="사용자 이름 또는 ID 검색"/>
                                            <div className="user-list">
                                                {users.map((user) => (
                                                    <div key={user.nickname} className="border p-2 my-2 flex flex-row items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className={"w-20"}><Image src={anonymous} alt={'프로필사진'} /></div>
                                                            <div className="ml-10">{user.nickname}</div>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="mr-5 w-7 h-7"
                                                            checked={inviteUsers.has(user.nickname)}
                                                            onChange={() => {
                                                                setInviteUsers((prev) => {
                                                                    const newSet = new Set(prev);
                                                                    if (newSet.has(user.nickname)) {
                                                                        newSet.delete(user.nickname); // 체크 해제 시 제거
                                                                    } else {
                                                                        newSet.add(user.nickname); // 체크 시 추가
                                                                    }
                                                                    return newSet;
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            {modalType === 'create' ?
                                                <button onClick={createChatRoom}> 생성 </button> :
                                                <button onClick={inviteChatRoom}> 초대 </button>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BaseModal