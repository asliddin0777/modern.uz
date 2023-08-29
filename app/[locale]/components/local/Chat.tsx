import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import { headers } from "next/dist/client/components/headers";
import { useRouter } from "next/router";
import Message from "./Message";
import { uuid as uuidv4 } from 'uuidv4';
import { io } from "socket.io-client";


interface SelectedProduct {
  author: string
}

interface Chat {
  setIsChatOpen:  React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: SelectedProduct
}

const Chat = ({ setIsChatOpen, selectedProduct }: Chat) => {
  const [chatListOpener, setChatListOpener] = useState<boolean>(false)
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any | undefined>()

  const router = useRouter()

  const [cookie] = useCookies(["userInfo"])

  const { userInfo } = cookie
  const URL = process.env.NEXT_PUBLIC_LOCAL_API;

  // @ts-ignore
  const socket = io(URL, { autoConnect: false });
  useEffect(() => {
    axios.get("/chats/user", {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
      setChats(res.data)
    }).catch(err => console.log(err))
  }, [])

  return (
    <>
      <div className={styles.chat}>
        <div className={styles.right}>
          <div className={styles.userTop}>
            <h3>Сообщения</h3>
          </div>
          <div className={styles.chatWith}>
            {chats.map((e) => {
              return (
                <div onClick={()=> {
                  socket.emit("chatSelected", e)
                  router.push(`/detail/${router.query.id}?chat=${e.id}`)
                  setSelectedChat(e)
                }} key={uuidv4()} className={styles.eachChat}>
                  <Image
                    src={"/images/user.png"}
                    alt="user image"
                    width={50}
                    height={50}
                  />
                  <div className={styles.chatWithWhom}>
                    <h4>{e.admin.email}</h4>
                    <p>Текст сообщения...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={!chatListOpener ? styles.left : styles.dn}>
          {!selectedChat ? <>
            <div className={styles.top}>
        <button onClick={() => {
          setChatListOpener(true)
        }} className={styles.arrowLeft}>
          <Image src={"/icons/arrowLeft.png"} width={20} height={20} alt="arrow left" />
        </button>
        <h3 /> 
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
      <p>Setartwefwefwe fw8eygf</p>
          </> : <Message chat={selectedChat} userInfo={userInfo} setIsChatOpen={setIsChatOpen} setChatListOpener={setChatListOpener} />}
        </div>
        <div className={chatListOpener ? styles.chats : styles.dn}>
          <div className={styles.userTop}>
            <h3>Сообщения</h3>
            <button
              onClick={() => {
                setIsChatOpen(false);
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
        </div>
      </div>
      <div className={styles.bg} />
    </>
  );
};

export default Chat;
