/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { socket } from "./socket";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [instance, setInstance] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        socket.auth = { token };

        if (!socket.connected) socket.connect();

        setInstance(socket);

        return () => {
            socket.off();
        };
    }, []);

    return (
        <SocketContext.Provider value={instance}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
