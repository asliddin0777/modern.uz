"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Message from "../components/local/Message";
import socket from "../components/local/socket";
import Head from "next/head";
import { Metadata, ResolvingMetadata } from 'next'
export const metadata: Metadata = {
  title: "Chat",
}
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: "wefwefwef",
  }
}
const Page = ({ params, searchParams }: Props) => {
  console.log(params);
  const [chatListOpener, setChatListOpener] = useState<boolean>(false)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState<any | undefined>()
  const [chat, setChat] = useState(false)
  const { push } = useRouter()
  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  useEffect(() => {
    socket.connect()
    axios.get(`/chats/user`, {
      headers: {
        Authorization: userInfo.userToken
      }
    }).then(res => {
      setChats(res.data)
    }).catch(err => console.log(err))
  }, [])
  return (
    <>
      <Head  >
        <title>eqwfhugqwufweyf</title>
      </Head>
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
                  push(`?chat=${e.id}`)
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
                  push("/")
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
            <p style={{ margin: "auto" }}>Select a chat to start messaging</p>
          </> : <Message chat={selectedChat} userInfo={userInfo} setIsChatOpen={setChat} setChatListOpener={setChatListOpener} />}
        </div>
        <div className={chatListOpener ? styles.chats : styles.dn}>
          <div className={styles.userTop}>
            <h3>Сообщения</h3>
            <button
              onClick={() => {
                push("/")
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
                  push(`?chat=${e.id}`)
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

export default Page;
