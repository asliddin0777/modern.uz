"use client";

import React, { memo, cache } from "react";
import styles from "@/styles/company.module.css";
import Categories from "../../components/global/Categories";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "../../components/global/Card";
import axios from "axios";
import Loader from "../../components/local/Loader";
import { useRouter } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../../components/local/socket";
import ChatWithVendor from "../../components/local/ChatWithVendor";
import Auth from "../../components/global/Auth";
import IChat from "@/interfaces/IChat";
const Company = ({
  searchParams,
}: {
  searchParams: {
    id: string;
  };
}) => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [refetch, setRefetch] = useState(false);
  const [load, setLoad] = useState<boolean>(true);
  const [likedObj, setLikedObj] = useState(false);

  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(2);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chat, setChat] = useState();
  const [iprod, setIprod] = useState<IProduct>();

  const { back, push, refresh } = useRouter()
  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;

  const [data, setData] = useState<object[] | any>([]);

  useEffect(() => {
    setLoad(true);
    const fetchData = cache(async () => {
      try {
        const categories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const subCategories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/vendors/${searchParams.id}`
        );
        const [res1, res2, dataget] = await axios.all([
          categories,
          subCategories,
          data,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setData(dataget.data);
      } finally {
        setLoad(false);
      }
    });
    fetchData();
  }, []);
  useEffect(() => {
    setLoad(true);
    if (refetch) {
      const fetchData = async () => {
        try {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/vendors/${searchParams.id}`
          );
          setData(data.data);
        } finally {
          refresh()
        }
      };
      fetchData();
    }
  }, [refetch]);
  const handleScroll = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }
  console.log(data);
  if (load === false && data) {
    return (
      <div className={styles.company}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          <section className={styles.companyTitle}>
            <div className={styles.companyProfile}>
              {data.baner && <Image src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${data.baner.name}`} alt="vendor image" width={1000} height={1000}
                className={styles.profileImage}
                style={{
                  background: `${getRandomColor()}`,
                }}
              />
              }
              <div className={styles.vendorTitle}>
                <div className={styles.profileSection}>
                  <div className={styles.profile}>
                    <h1>
                      {data && data.name}
                    </h1>
                  </div>
                </div>
                <div
                  className={styles.chatButton}
                  onClick={() => {
                    if (userInfo !== undefined) {
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
                            admin: data.products[0].author,
                          },
                          {
                            headers: {
                              Authorization: userInfo.userToken,
                            },
                          }
                        )
                        .then((res) => {
                          setChat(res.data);
                          push(`/chats?id=${res.data.id}`)
                        });
                    } else {
                      setAuth(!auth);
                      setFromWhere(2);
                    }
                  }}
                >
                  <p>Написать поставщику</p>
                </div>
              </div>
            </div>
            <div className={styles.companyDescrip}>
              <p>Описание</p>
              <p>
                {data && data.description}
              </p>
            </div>
          </section>
          {data && data.products.length > 0 && <h2 style={{
            marginTop: 32
          }}>Товары поставщика</h2>}
          <section className={styles.companyCards}>
            {data &&
              data.products &&
              data.products.map((e: IProduct) => {
                return (
                  <Card
                    isLiked
                    setLikedObj={() => { }}
                    setData={setRefetch}
                    card={e}
                    animation="fade-down"
                    cat={e.subcategory.name}
                    url={e.id}
                    height={300}
                    width={300}
                    image={
                      e.media.length > 0
                        ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[0]?.name}`
                        : "/images/noImg.jpg"
                    }
                    title={e.name}
                    price={String(e.price[0].price)}
                    key={e.id}
                  />
                );
              })}
          </section>
        </div>
        {auth === true && (
          <Auth
            setIsAuthOpen={setAuth}
            fromWhere={fromWhere}
            isAuthOpen={auth}
            setFromWhere={setFromWhere}
          />
        )}
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Company);
