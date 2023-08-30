import React, { useEffect, useReducer, useRef, useState } from 'react'
import Image from 'next/image'
import styles from "@/styles/chat.module.css"
import axios from 'axios'
import { uuid as uuidv4 } from 'uuidv4';
import { io } from 'socket.io-client';
import Card from '../global/Card';
import socket from './socket';
import { IMessage } from '@/interfaces/IMessage';
interface UserInfo {
  userId: string;
  userToken: string;
  userPhoneNumber: number
}

interface SelectedProduct {
  author: string
  category: {
    id: string
    name: string
  }
  description: string
  id: string
  likes: string[]
  media: {
    name: string
    fileId: string
  }[]
  price: {
    price: number
    oldPrice: number
    qtyMax: number
    qtyMin: number
  }[]
  props: {
    id: string
    prop: {
      id: string
      name: string
      label: string
    }
    value: string
  }[]
  reviews: []
  subcategory: {
    name: string
    id: string
  }
  name: string
}


interface ChatHandler {
  setChatListOpener: React.Dispatch<React.SetStateAction<boolean>>
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
  chat: any
  userInfo: UserInfo
  selectedProduct: SelectedProduct
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
      console.log(res.data);
    }).catch(err => console.log(err))

  }, [chat])
  console.log(messages);
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
        {selectedProduct && <Card
          isLiked={false}
          setLikedObj={() => { }}
          url={`${selectedProduct.id}`}
          title={selectedProduct.name}
          image={selectedProduct.media.length ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedProduct.media[0].name}` : undefined}
          width={300}
          height={300}
          price={`${selectedProduct.price[0].price}`}
          cat={selectedProduct.category.name}
          key={uuidv4()}
          animation=""
        />}
      </div>
        {messages && messages?.map((m: IMessage) => {
          return <div key={uuidv4()} className={m.reciever !== userInfo.userId ? styles.message : styles.messageS}>
           {m.message&&<p>{m.message}</p>}
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
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.sendMessage}>
        <input value={message} onChange={(text) => setMesage(text.target.value)} type="text" placeholder="Напишите сообщение..." />
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
          <svg fill="#ffae00" width="30px" height="30px" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffae00" stroke-width="0.00032">

            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192" />

            <g id="SVGRepo_iconCarrier"> <title>paper-plane-top</title> <path d="M31.083 16.589c0.105-0.167 0.167-0.371 0.167-0.589s-0.062-0.421-0.17-0.593l0.003 0.005c-0.030-0.051-0.059-0.094-0.091-0.135l0.002 0.003c-0.1-0.137-0.223-0.251-0.366-0.336l-0.006-0.003c-0.025-0.015-0.037-0.045-0.064-0.058l-28-14c-0.163-0.083-0.355-0.132-0.558-0.132-0.691 0-1.25 0.56-1.25 1.25 0 0.178 0.037 0.347 0.104 0.5l-0.003-0.008 5.789 13.508-5.789 13.508c-0.064 0.145-0.101 0.314-0.101 0.492 0 0.69 0.56 1.25 1.25 1.25 0 0 0 0 0.001 0h-0c0.001 0 0.002 0 0.003 0 0.203 0 0.394-0.049 0.563-0.136l-0.007 0.003 28-13.999c0.027-0.013 0.038-0.043 0.064-0.058 0.148-0.088 0.272-0.202 0.369-0.336l0.002-0.004c0.030-0.038 0.060-0.082 0.086-0.127l0.003-0.006zM4.493 4.645l20.212 10.105h-15.88zM8.825 17.25h15.88l-20.212 10.105z" /> </g>

          </svg></button>
      </form>
    </>
  )
}

export default Message