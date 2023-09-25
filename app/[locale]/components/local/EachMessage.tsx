import React, { memo, useEffect, useState } from 'react'
import Image from "next/image"
import styles from "@/styles/chat.module.css"
import { IMessage } from '@/interfaces/IMessage';
import socket from './socket';
interface UserInfo {
    userId: string;
    userToken: string;
    userPhoneNumber: number
}
interface IProps {
    userInfo: UserInfo
    m: IMessage
    updateMessageViewStatus: Function
}
const EachMessage = ({ userInfo, m, updateMessageViewStatus }: IProps) => {
    const serverURL = process.env.NEXT_PUBLIC_API
    const image: string[] = ["jpg", "png", 'jpeg']
    const video = ['mp4']
    const [viewed, setViewed] = useState<boolean>(m.viewed)
    function sendMessage(msg: IMessage) {
        if (msg.sender === userInfo.userId) {
            setViewed(msg.viewed);
        }
    }
    useEffect(() => {
        socket.on(String(m.id)!, sendMessage);
        return () => {
            socket.off(String(m.id)!, sendMessage);
        };
    }, [setViewed]);

    useEffect(() => {
        if (m.sender != userInfo.userId && m.viewed === false) { socket.emit("messageViewed", { ...m, msg: "from client" }); }
    }, []);
    return (
        <div key={m.id} className={m.reciever !== userInfo.userId ? styles.message : styles.messageS}>
            {m.message && <p>{m.message}</p>}
            {m.file && image.find(i => i === m.file.split('.')[1].toLocaleLowerCase()) && <img className='' style={{
                width: 300,
                height: "auto",
                borderRadius: 15
            }} src={serverURL + '/' + m.file} />}
            {m.file && video.find(i => i === m.file.split('.')[1].toLocaleLowerCase()) && <video style={{
                width: 300,
                height: "auto",
                borderRadius: 15
            }} controls className='w-75'  >
                <source src={serverURL + '/' + m.file} /></video>}
            <div className={styles.messageInfo}>
                <div className={styles.createdAt}>
                    <Image
                        src={"/icons/date.svg"}
                        width={20}
                        height={23}
                        alt="created at"
                    />
                    <p>{new Date(m.createdAt).toDateString()}</p>
                </div>
                {userInfo.userId !== m.reciever && <div className={styles.view}>
                    {viewed === false ? <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M5.5 12.5L10.167 17L19.5 8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            </path>
                        </g>
                    </svg> : <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.03033 11.4697C4.73744 11.1768 4.26256 11.1768 3.96967 11.4697C3.67678 11.7626 3.67678 12.2374 3.96967 12.5303L5.03033 11.4697ZM8.5 16L7.96967 16.5303C8.26256 16.8232 8.73744 16.8232 9.03033 16.5303L8.5 16ZM17.0303 8.53033C17.3232 8.23744 17.3232 7.76256 17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967L17.0303 8.53033ZM9.03033 11.4697C8.73744 11.1768 8.26256 11.1768 7.96967 11.4697C7.67678 11.7626 7.67678 12.2374 7.96967 12.5303L9.03033 11.4697ZM12.5 16L11.9697 16.5303C12.2626 16.8232 12.7374 16.8232 13.0303 16.5303L12.5 16ZM21.0303 8.53033C21.3232 8.23744 21.3232 7.76256 21.0303 7.46967C20.7374 7.17678 20.2626 7.17678 19.9697 7.46967L21.0303 8.53033ZM3.96967 12.5303L7.96967 16.5303L9.03033 15.4697L5.03033 11.4697L3.96967 12.5303ZM9.03033 16.5303L17.0303 8.53033L15.9697 7.46967L7.96967 15.4697L9.03033 16.5303ZM7.96967 12.5303L11.9697 16.5303L13.0303 15.4697L9.03033 11.4697L7.96967 12.5303ZM13.0303 16.5303L21.0303 8.53033L19.9697 7.46967L11.9697 15.4697L13.0303 16.5303Z" fill="#000000"></path> </g></svg>}
                </div>}
            </div>
        </div>
    )
}

export default memo(EachMessage)
