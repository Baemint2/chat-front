// 마지막 접속시간 업데이트
export const updateLastSeenDt = (chatRoomId: number, userId: number | undefined) => {
    const body = {
        chatRoomId,
        userId
    }
    fetch('http://localhost:8090/chat-room/last-seen-update', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response
    })
}

// 채팅방 내의 메시지 목록 가져오기
export const getChatMessages = async (chatRoomNo: number | undefined, userId: number | undefined) => {
    const body = {
        chatRoomId: chatRoomNo,
        userId
    }
    const response = await fetch("http://localhost:8090/message/get", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(body)
    })
    const data = await response.json()
    return data.message

}

// 채팅방 나가기
export const leaveChatRoom = (chatRoomId: number | null, userId: number | undefined) => {
    const body = {
        chatRoomId,
        userId,
    }

    if (window.confirm("방을 나가시겠습니까?")) {
        fetch(`http://localhost:8090/chat-room/leave`, {
            method: 'post',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response => {
            if (response.ok) console.log("방을 나가셨습니다.");
            else console.log("방 나가기 실패 ");
        })).catch((e) => {
            console.log(e)
        })
    } else {
        console.log("취소")
    }
}

export const getChatRoom = async (username: String) => {
    const response = await fetch(`http://localhost:8090/chat-room/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.chatRoom;
};