"use client";

import React, { memo } from "react";
import styles from "@/styles/company.module.css";
import TopHeader from "../components/global/TopHeader";
import Header from "../components/global/Header";
import Categories from "../components/global/Categories";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "../components/global/Card";
import Footer from "../components/global/Footer";
import Link from "next/link";
import axios from "axios";
import Loader from "../components/local/Loader";
import { useRouter, usePathname } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../components/local/socket";
import ChatWithVendor from "../components/local/ChatWithVendor";
import Auth from "../components/global/Auth";

const Company = () => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chat, setChat] = useState();
  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const subCategories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/vendors`
        );
        const [res1, res2, dataget] = await axios.all([
          categories,
          subCategories,
          data,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setData(dataget.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  const [data, setData] = useState<object[] | any>([]);

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }

  if (!load) {
    return (
      <div className={styles.company}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          {data &&
            data.map((e: any, index: number) => {
              return (
                <div className={styles.cards} key={e.id}>
                  <div className={styles.card__left}>
                    <Link
                      style={{
                        color: "#000",
                      }}
                      href={`/company/${e.id}`}
                      as={`/company/${e.name}?id=${e.id}`}
                      className={styles.card__title}
                    >
                      {/* <Image
                              src={"/icons/profile.svg"}
                              height={57}
                              width={57}
                              alt="profile"
                            /> */}
                      <div
                        className={styles.profileImage}
                        style={{
                          background: `${getRandomColor()}`,
                        }}
                      >
                        {e.name[0]}
                      </div>
                      <div>
                        <h3>{e.name}</h3>
                      </div>
                    </Link>
                    <div className={styles.description}>
                      <p>Описание</p>
                      <p>{e.description}</p>
                    </div>
                  </div>
                  <div className={styles.card__right}>
                    <div className={styles.cards__button}>
                      <div
                        className={styles.chatButton}
                        onClick={() => {
                          console.log(data);
                          if (userInfo !== undefined) {
                            setIsChatOpen(!isChatOpen);
                            socket.connect();
                            socket.emit(
                              "newUser",
                              JSON.stringify({
                                id: userInfo.userId,
                                fullName: `${localStorage.getItem(
                                  "userName"
                                )} ${localStorage.getItem("lastName")}`,
                              })
                            );
                            axios
                              .post(
                                `${process.env.NEXT_PUBLIC_API}/api/chats/new`,
                                {
                                  author: e.produts[0].author
                                },
                                {
                                  headers: {
                                    Authorization: userInfo.userToken,
                                  },
                                }
                              )
                              .then((res) => {
                                setChat(res.data);
                              });
                          } else {
                            setAuth(!auth);
                            setFromWhere(2);
                          }
                        }}
                      >
                        <Image
                          src={"/icons/chat.svg"}
                          alt="chat icon"
                          width={43}
                          height={39}
                        />
                        <p> Написать поставщику</p>
                      </div>
                    </div>
                    {auth === true && (
                      <Auth
                        setIsAuthOpen={setAuth}
                        fromWhere={fromWhere}
                        isAuthOpen={auth}
                        setFromWhere={setFromWhere}
                      />
                    )}
                    {isChatOpen === true && (
                      <ChatWithVendor
                        chat={chat}
                        setChatListOpener={() => {}}
                        userInfo={userInfo}
                        selectedProduct={undefined}
                        setIsChatOpen={setIsChatOpen}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Company);
