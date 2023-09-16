import React, { useEffect, useReducer, useRef, useState } from 'react'
import Image from 'next/image'
import styles from "@/styles/chat.module.css"
import axios from 'axios'
import { uuid as uuidv4 } from 'uuidv4';
import { io } from 'socket.io-client';
import Card from '../global/Card';
import socket from './socket';
import { IMessage } from '@/interfaces/IMessage';
import IProduct from '@/interfaces/Product/IProduct';
import SendMessage from './SendMessage';
import EachMessage from './EachMessage';
import IUser from '@/interfaces/IUser';
interface UserInfo {
  userId: string;
  userToken: string;
  userPhoneNumber: number
}
interface ChatHandler {
  setChatListOpener: React.Dispatch<React.SetStateAction<boolean>>
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  chat: any
  userInfo: UserInfo
  selectedProduct: IProduct
}

const Message = ({ setChatListOpener, setIsChatOpen, chat, userInfo, selectedProduct }: ChatHandler) => {
  const [messages, setMessages] = useState<IMessage[] | undefined>([])
  const image: string[] = ["jpg", "png", 'jpeg']
  const video = ['mp4']
  const serverURL = "http://192.168.0.111:3000"
  const [message, setMesage] = useState<string | undefined>("")
  const [resive, setResive] = useState<IMessage>()
  const endRef = useRef<any>()
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats/user/${chat.id}`, {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
      setMessages(res.data.messages)
    }).catch(err => console.log(err))
  }, [chat])
  useEffect(()=> {
    document.body.style.overflow = "hidden"
  },[])
  useEffect(() => {
    endRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages])
  useEffect(() => {
    endRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [])

  const sendMessage = (msg: any) => {
    setMessages((prev: any) => [...prev, msg])
  }
  function updateMessageViewStatus(msg: IMessage) {
    if (msg.reciever === userInfo.userId) {
      setMessages((prev) =>
        prev && prev.map((m) => {
          if (m.id === msg.id) {
            return { ...msg, status: true };
          }
          return m;
        })
      );
    }
  }

  useEffect(() => {
    socket.on('sendMessage', sendMessage)
    return () => {
      socket.off('sendMessage', sendMessage)
    }
  }, [setMessages])

  const handleFileSubmit = (e: any) => {
    const msg = {
      reciever: selectedProduct.author,
      sender: userInfo.userId,
      chat: chat.id,
      file: { buffer: e.target.files[0], type: e.target.files[0].type, originalName: e.target.files[0].name, },
    }
    socket.emit('recieveMsg', msg)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (message && message.length > 0) {
      const msg = {
        reciever: chat.admin.id,
        message,
        sender: userInfo.userId,
        chat: chat.id
      }
      socket.emit('recieveMsg', msg)
      setMesage('')
    }
  }
  // const {messages:gugu} = message
  
  return (
    <>
      <div className={styles.top}>
        <button onClick={() => {
          setChatListOpener(true)
        }} className={styles.arrowLeft}>
          <Image src={"/icons/arrowLeft.png"} width={20} height={20} alt="arrow left" />
        </button>
        <h3>Поставщик</h3>
        <button
          onClick={() => {
            setIsChatOpen(false);
            socket.disconnect()
          }}
        >
          <Image
            src={"/icons/close.svg"}
            alt="close chat icon"
            width={21}
            height={21}
          />
        </button>
      </div>
      <div className={styles.mainChat}>
        <div className={styles.selectedCard}>
          {selectedProduct &&
            <Card
              setData={() => { }}
              isLiked={false}
              setLikedObj={() => { }}
              url={`${selectedProduct.id}`}
              title={selectedProduct.name}
              image={selectedProduct.media?.length ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedProduct.media[0].name}` : undefined}
              width={300}
              height={300}
              price={`${selectedProduct.price[0].price}`}
              cat={selectedProduct.category.name}
              key={uuidv4()}
              animation=""
            />}
        </div>
        {messages && messages?.map((m: IMessage) => {
          return <EachMessage updateMessageViewStatus={updateMessageViewStatus} userInfo={userInfo} m={m} />
        })}
        <div ref={endRef} />
      </div>
      <SendMessage userInfo={userInfo} chat={chat} selectedProduct={selectedProduct} />
    </>
  )
}

export default Message