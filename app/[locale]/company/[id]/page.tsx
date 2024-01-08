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
    const fetchData = async () => {
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
    }
    fetchData();
  }, []);
  const handleScroll = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('scroll', handleScroll, { passive: false });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(()=> {
    if (data && data.name) {
      document.title = `Vendor - ${data.name}`
    } else {
      document.title = 'Vendor'
    }
  },[data])
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
                      push("/auth/login")
                    }
                  }}
                >
                  <p>Yetkazib beruvchiga yozish</p>
                </div>
              </div>
            </div>
            <div className={styles.companyDescrip}>
              <p>Tavsif</p>
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Company);
