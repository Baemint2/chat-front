'use client'

import React, {useEffect, useState} from "react";
import BaseModal from "./BaseModal";
import {ChatRoom} from "@/app/types/chatroom";

interface InviteModalProps {
    isOpen: boolean,
    isClose: () => void
    modalTitle: string
    chatRoomInfo?: ChatRoom
}

const InviteModal: React.FC<InviteModalProps> = ({
                                                     isOpen,
                                                     isClose,
                                                     modalTitle,
                                                     chatRoomInfo
                                                         }) => {
    const [title, setTitle] = useState<string>(modalTitle);

    useEffect(() => {
        if (isOpen) {
            setTitle(modalTitle);
        }
    }, [isOpen, modalTitle]);

    return (
        <BaseModal isOpen={isOpen} isClose={isClose}  modalTitle={title}
                   chatRoomInfo={chatRoomInfo}/>
    )
}
export default InviteModal;