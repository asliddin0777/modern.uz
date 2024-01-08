import { userInfo } from 'os'
import React, { memo, useState } from 'react'
import socket from './socket'
import Image from 'next/image'
import styles from "@/styles/chat.module.css"
import IProduct from '@/interfaces/Product/IProduct'
interface UserInfo {
    userId: string;
    userToken: string;
    userPhoneNumber: number
}
interface IProps {
    chat: any
    selectedProduct?: IProduct
    userInfo: UserInfo
}
const SendMessage = ({chat, selectedProduct, userInfo}: IProps) => {
    const [message, setMesage] = useState<string>("")
    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (message && message.length > 0) {
            const msg = {
                reciever: typeof chat.admin === "string" ? chat.admin : chat.admin.id,
                message,
                sender: userInfo.userId,
                chat: chat.id
            }
            socket.emit('recieveMsg', msg)
            setMesage('')
        }
    }
    const handleFileSubmit = (e: any) => {
        const msg = {
            reciever: typeof chat.admin === "string" ? chat.admin : chat.admin.id,
            sender: userInfo.userId,
            chat: chat.id,
            file: { buffer: e.target.files[0], type: e.target.files[0].type, originalName: e.target.files[0].name, },
        }
        socket.emit('recieveMsg', msg)
    }
    return (
        <form onSubmit={handleSubmit} className={styles.sendMessage}>
            <input value={message} onChange={(text) => setMesage(text.target.value.trimStart())} type="text" placeholder="Xabar yozing..." />
            <label>
                <Image
                    src={"/icons/sendImg.svg"}
                    alt="image send icon"
                    width={16}
                    height={27}
                />
                <input onChange={handleFileSubmit} type="file" hidden name="file" id="" accept='image/*' />
            </label>
            <button type='submit'>
                <svg fill="#ffae00" width="30px" height="30px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffae00" strokeWidth="0.00032">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.192" />
                    <g id="SVGRepo_iconCarrier"> <title>paper-plane-top</title> <path d="M31.083 16.589c0.105-0.167 0.167-0.371 0.167-0.589s-0.062-0.421-0.17-0.593l0.003 0.005c-0.030-0.051-0.059-0.094-0.091-0.135l0.002 0.003c-0.1-0.137-0.223-0.251-0.366-0.336l-0.006-0.003c-0.025-0.015-0.037-0.045-0.064-0.058l-28-14c-0.163-0.083-0.355-0.132-0.558-0.132-0.691 0-1.25 0.56-1.25 1.25 0 0.178 0.037 0.347 0.104 0.5l-0.003-0.008 5.789 13.508-5.789 13.508c-0.064 0.145-0.101 0.314-0.101 0.492 0 0.69 0.56 1.25 1.25 1.25 0 0 0 0 0.001 0h-0c0.001 0 0.002 0 0.003 0 0.203 0 0.394-0.049 0.563-0.136l-0.007 0.003 28-13.999c0.027-0.013 0.038-0.043 0.064-0.058 0.148-0.088 0.272-0.202 0.369-0.336l0.002-0.004c0.030-0.038 0.060-0.082 0.086-0.127l0.003-0.006zM4.493 4.645l20.212 10.105h-15.88zM8.825 17.25h15.88l-20.212 10.105z" /> </g>
                </svg></button>
        </form>
    )
}

export default memo(SendMessage)
