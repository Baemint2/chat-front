'use client'

import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface StompContextProps {
    stompClient: Client | null;
    isConnected: boolean;
}

const StompContext = createContext<StompContextProps | undefined>(undefined);

const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
};

// ✅ STOMP Provider
export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stompClientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (stompClientRef.current) return;

        const username = getCookie("username");
        if (!username) {
            console.error("🚨 No username found in cookies!");
            return;
        }

        const socket = new SockJS("http://localhost:8090/chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders: {
                username: username,
            },
            onConnect: () => {
                console.log(`✅ STOMP Connected as ${username}`);
                setIsConnected(true);
            },
            onDisconnect: () => {
                console.log("❌ STOMP Disconnected!");
                setIsConnected(false);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <StompContext.Provider value={{ stompClient: stompClientRef.current, isConnected }}>
            {children}
        </StompContext.Provider>
    );
};


export const useStomp = () => {
    const context = useContext(StompContext);
    if (!context) {
        throw new Error("useStomp must be used within a StompProvider");
    }
    return context;
};
