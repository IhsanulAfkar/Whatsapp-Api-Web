'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "socket.io"
import { io as ClientIO } from 'socket.io-client'
import { DefaultEventsMap } from "socket.io/dist/typed-events"
type SocketContextType = {
    socket: any | null,
    isConnected: boolean
}
const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})
export const useSocket = () => {
    return useContext(SocketContext)
}
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setsocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>()
    const [isConnected, setisConnected] = useState(false)
    useEffect(() => {
        // console.log(process.env.NEXT_PUBLIC_BASE_URL)
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            // path: '/',
            // addTrasockerilingSlash: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        })

        socketInstance.on("connect", () => {
            console.log(socketInstance.id)

            socketInstance.emit('message', 'Hello from client!');
            setisConnected(true)
        })

        socketInstance.on('statusUpdate', (data: any) => {
            console.log('Received status update:', data);
        });

        socketInstance.on('message', (message: any) => {
            console.log(`Received message from server: ${message}`);
        });
        socketInstance.on("disconnected", () => {
            console.log('socket disconnected')
            setisConnected(false)
        })
        setsocket((socketInstance as any))
        return () => {
            socketInstance.disconnect()
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}