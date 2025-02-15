'use client'

import {useState} from "react";

export default function Login() {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin2 = async () => {
        const data = new URLSearchParams({
            username: username,
            password: password,
        });

        const response = await fetch("http://localhost:8090/login", {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: "post",
            body: data,
            credentials: 'same-origin'
        });
        console.log(response);
        window.location.href = response.url
        // const test = await response.json();
        // console.log(test)
    };

    return (

        <div className="login-container">
            <h1 className="text-3xl font-bold text-center mb-5">간편 로그인 하기</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>아이디</label>
                <input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // ✅ 입력값 변경 시 상태 업데이트
                />
                <label>비밀번호</label>
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // ✅ 입력값 변경 시 상태 업데이트
                />
                <button onClick={handleLogin2}>로그인</button>
            </form>
        </div>
    )
}