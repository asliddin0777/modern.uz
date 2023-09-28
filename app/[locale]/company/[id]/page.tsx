"use client";

import React, { memo } from "react";
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
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chat, setChat] = useState();
  const [iprod, setIprod] = useState<IProduct>();

  const { back, push } = useRouter()
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (refetch) {
      setLoad(true);
      const fetchData = async () => {
        try {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/vendors/${searchParams.id}`
          );
          setData(data.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoad(false);
        }
      };
      fetchData();
    }
  }, [refetch]);
  console.log(data);
  const [nav, setNav] = useState<number>(0);
  const { id }: any = useRouter();

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }

  if (load === false && data) {
    return (
      <div className={styles.company}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          <section className={styles.companyTitle}>
            <div className={styles.companyProfile}>
              <div className={styles.profileSection}>
                {" "}
                <div
                  className={styles.profileImage}
                  style={{
                    background: `${getRandomColor()}`,
                  }}
                >
                  {data.name[0]}
                </div>
                <div className={styles.profile}>
                  <h1>
                    {data && data.name}
                  </h1>
                </div>
              </div>
              <div
                className={styles.chatButton}
                onClick={() => {
                  console.log(data);
                  if (userInfo !== undefined && data && data.products && data.products.length > 0) {
                    console.log(data.products[0].author);
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
                <p>Написать поставщику</p>
              </div>
            </div>
            <div className={styles.companyDescrip}>
              <p>Описание</p>
              <p>
                {data
                  ? data.description
                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
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
          {/* <div className={styles.carusel}>
            <div
              style={{
                backgroundColor: "#E4B717",
                width: 39,
                height: 39,
                borderRadius: "100%",
                textAlign: "center",
                paddingTop: 8,
              }}
            >
              <Link style={{ color: "#fff" }} href="#">
                1
              </Link>
            </div>
            <Link href="#">2</Link>
            <Link href="#">3</Link>
            <Link href="#">...</Link>
            <Link href="#">5</Link>
          </div> */}
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
