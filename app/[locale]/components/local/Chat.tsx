"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter, usePathname } from "next/navigation";
import Message from "./Message";
import socket from "./socket";
import IProduct from "@/interfaces/Product/IProduct";

interface Chat {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct?: IProduct
}
const Chat = ({ setIsChatOpen, selectedProduct }: Chat) => {
  const path = usePathname()
  const [chatListOpener, setChatListOpener] = useState<boolean>(false)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState<any | undefined>()
  const router = useRouter()
  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats/user`, {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
      setChats(res.data)
      console.log(res.data);
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
            {chats.map((e: any) => {
              return (
                <div onClick={() => {
                  socket.emit("chatSelected", e)
                  router.push(`?chat=${e.id}`)
                  setSelectedChat(e)
                }} key={e.id} className={styles.eachChat}>
                  <Image
                    src={"/icons/userimage.jpg"}
                    style={{
                      borderRadius: 100
                    }}
                    alt="user image"
                    width={50}
                    height={50}
                  />
                  <div className={styles.chatWithWhom}>
                    <h4>{e.admin?.email}</h4>
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
            <p style={{margin: "auto"}}>Select a chat to start messaging</p>
          </> : <Message selectedProduct={selectedProduct!} chat={selectedChat} userInfo={userInfo} setIsChatOpen={setIsChatOpen} setChatListOpener={setChatListOpener} />}
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
          <div className={styles.chatWith}>
            {chats.map((e: any) => {
              return (
                <div onClick={() => {
                  socket.emit("chatSelected", e)
                  // router.push(`/product/${path.split("/")[path.split("/").length - 1]}`)
                  setSelectedChat(e)
                  setChatListOpener(false)
                }} key={e.id} className={styles.eachChat}>
                  <Image
                    src={"/images/user.png"}
                    alt="user image"
                    width={50}
                    height={50}
                  />
                  <div className={styles.chatWithWhom}>
                    <h4>{e?.admin?.email}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.bg} />
    </>
  );
};

export default Chat;
