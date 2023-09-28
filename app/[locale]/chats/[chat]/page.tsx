"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Message from "../../components/local/Message";
import socket from "../../components/local/socket";
import Head from "next/head";
import IChat from "@/interfaces/IChat";
import Loader from "../../components/local/Loader";
const Page = ({ searchParams }: {
  searchParams: {
    id: string
  }
}) => {
  const [chatListOpener, setChatListOpener] = useState<boolean>(false)
  const [chats, setChats] = useState<IChat[]>([])
  const [selectedChat, setSelectedChat] = useState<any | undefined>()
  const [chat, setChat] = useState(false)
  const { push, back } = useRouter()
  const [chatWith, setChatWith] = useState<IChat>()
  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  const [load, setLoad] = useState(true)
  useEffect(() => {
    axios.get<IChat[]>(`${process.env.NEXT_PUBLIC_API}/api/chats/user`, {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
     if(!socket.connected) {
      socket.connect();
      console.log('connected');
     }
      setChats(res.data)
      setChatWith(res.data.find(e => {
        if (e.id === searchParams.id) {
          socket.emit('chatSelected',e)
          return e
        }
      }))
    }).catch(err => console.log(err)).finally(() => setLoad(false))
  }, [])
  if (chats && load === false) {
    return (
      <>
        <Head  >
          <title>eqwfhugqwufweyf</title>
        </Head>
        <div className={styles.chat}>
          <div className={styles.right}>
            <div onClick={() => {
              push("/chats")
            }} className={styles.userTop}>
              <h3>Сообщения</h3>
            </div>
            <div className={styles.chatWith}>
              {chats && chats.map((e: any) => {
                return (
                  <div onClick={() => {
                    socket.emit("chatSelected", e)
                    push(`/chats/${e.admin.email.split("@")[0]}?id=${e.id}`)
                    setSelectedChat(e)
                  }} key={e.id} className={styles.eachChat}>
                    <Image
                      src={"/icons/userimage.jpg"}
                      alt="user image"
                      style={{
                        borderRadius: 100
                      }}
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
            {chatWith &&
              <Message chat={chatWith} userInfo={userInfo} setIsChatOpen={setChat} setChatListOpener={setChatListOpener} />
            }
          </div>
          <div className={chatListOpener ? styles.chats : styles.dn}>
            <div className={styles.userTop}>
              <h3>Сообщения</h3>
              <button
                onClick={() => {
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
            <div className={styles.chatWith}>
              {chats && chats.map((e: any) => {
                return (
                  <div onClick={() => {
                    socket.emit("chatSelected", e)
                    push(`/chats/${e.admin.email.split("@")[0]}?id=${e.id}`)
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
  } else {
    return <Loader />
  }
};

export default Page;
