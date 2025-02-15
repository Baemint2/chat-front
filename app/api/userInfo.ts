export const getUserInfo = async () => {
    const getCookie = (name: string) => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    };
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userInfo/${getCookie("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json(); // 데이터를 반환
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
    }
};