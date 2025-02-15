// 마지막 접속시간 업데이트
export const updateLastSeenDt = (chatRoomId: number, userId: number | undefined) => {
    const body = {
        chatRoomId,
        userId
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-room/last-seen-update`, {
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
export const getChatMessages = async (chatRoomNo: number | null, pageNum: number | undefined) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/message/get/${chatRoomNo}?page=${pageNum}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/JSON'
        }
    })
    const data = await response.json()
    return data.content

}

// 채팅방 나가기
export const leaveChatRoom = (chatRoomId: number | null, userId: number | undefined) => {
    const body = {
        chatRoomId,
        userId,
    }

    if (window.confirm("방을 나가시겠습니까?")) {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-room/leave`, {
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

// 채팅방 정보 가져오기
export const getChatRoom = async (username: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-room/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.chatRoom;
};