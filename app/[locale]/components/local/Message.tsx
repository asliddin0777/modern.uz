import React, { memo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from "@/styles/chat.module.css"
import axios from 'axios'
import Card from '../global/Card';
import socket from './socket';
import { IMessage } from '@/interfaces/IMessage';
import IProduct from '@/interfaces/Product/IProduct';
import SendMessage from './SendMessage';
import EachMessage from './EachMessage';
import { useRouter } from 'next/navigation';
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
  selectedProduct?: IProduct
}

const Message = ({ setChatListOpener, setIsChatOpen, chat, userInfo, selectedProduct }: ChatHandler) => {
  const [messages, setMessages] = useState<IMessage[] | undefined>([])
  const { push, back } = useRouter()
  const endRef = useRef<any>()
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats/user/${chat.id}`, {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
      setMessages(res.data.messages)
    }).catch(err => console.log(err))
  }, [chat, setMessages])
  useEffect(() => {
    document.body.style.overflow = "hidden"
    endRef.current.scrollIntoView({
      behavior: "smooth"
    });
  })
  // useEffect(() => {
  //   endRef.current.scrollIntoView({
  //     behavior: "smooth"
  //   });
  // })

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
   
    socket.on(`sendMessage-${chat.id}`, sendMessage)
    return () => {
      socket.off(`sendMessage-${chat.id}`, sendMessage)
    }
  }, [chat, setMessages])

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
            socket.disconnect()
            back()
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
              key={selectedProduct.id}
              animation=""
            />}
        </div>
        {messages && messages?.map((m: IMessage) => {
          return <EachMessage key={m.id} updateMessageViewStatus={updateMessageViewStatus} userInfo={userInfo} m={m} />
        })}
        <div ref={endRef} />
      </div>
      <SendMessage userInfo={userInfo} chat={chat} selectedProduct={selectedProduct} />
    </>
  )
}

export default memo(Message)
