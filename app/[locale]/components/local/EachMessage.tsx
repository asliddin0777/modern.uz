import IProduct from '@/interfaces/Product/IProduct';
import React, { useEffect } from 'react'
import { uuid as uuidv4 } from 'uuidv4';
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
    const serverURL = "http://192.168.0.104:3000"
    const image: string[] = ["jpg", "png", 'jpeg']
    const video = ['mp4']
    
    useEffect(() => {
        if (m.id) {
            console.log("wefwefwef");
          socket.on(m.id.toString(), (msg) => {
            updateMessageViewStatus(msg)
          });
        }
    
        if (!m.viewed) {
          socket.emit("messageViewed", m);
          return updateMessageViewStatus(m);
        }
        return () => {};
      }, []);
    return (
        <div key={uuidv4()} className={m.reciever !== userInfo.userId ? styles.message : styles.messageS}>
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
            <div className={styles.createdAt}>
                <Image
                    src={"/icons/date.svg"}
                    width={20}
                    height={23}
                    alt="created at"
                />
                <p>{new Date(m.createdAt).toString()}</p>
            </div>
        </div>
    )
}

export default EachMessage