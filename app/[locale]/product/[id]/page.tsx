"use client";
import React, { cache, memo, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Categories from "../../components/global/Categories";
import styles from "@/styles/detail.module.css";
import Image from "next/image";
import Order from "../../components/global/Order";
import Link from "next/link"
import axios from "axios";
import Loader from "../../components/local/Loader";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../../components/local/socket";
import IProduct from "@/interfaces/Product/IProduct";
import StorageButton from "../../components/local/StorageButton";
import IChat from "@/interfaces/IChat";
import Success from "../../components/local/Success";
import Error from "../../components/local/Error";
import { useRouter } from "next/navigation";

import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/pagination';

const Detail = ({
  searchParams,
}: {
  searchParams: {
    id: string;
  };
}) => {
  const [chat, setChat] = useState<IChat>()
  const { push } = useRouter()
  const [controllerM, setControllerM] = useState<number>(0);
  const [order, setOrder] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [textLength, setTextLength] = useState<number>(1000);
  const [data, setData] = useState<IProduct>();
  const [props, setProps] = useState<any | any[]>([]);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [succed, setSucced] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [selectedMemory, setSelectedMemory] = useState<string>("");
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [cookie] = useCookies(["userInfo"]);
  const [error, setErr] = useState<boolean>(false)
  const { userInfo } = cookie;
  useEffect(() => {
    order !== true
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  }, [order]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const req1 = await axios.get<IProduct>(
          `${process.env.NEXT_PUBLIC_API}/api/products/${searchParams.id}`
        );
        const req2 = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/props`
        );
        const req3 = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const req4 = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const [res1, res2, res3, res4] = await axios.all([
          req1,
          req2,
          req3,
          req4,
        ]);
        setData(req1.data);
        setProps(res2.data);
        setCategories(res3.data);
        setSubCategories(res4.data);
      } finally {
        setLoad(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      document.title = `Product - ${data.name}`
    }
  }, [data])

  const pagination: object = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  const videoRef = useRef<HTMLVideoElement | any>();
  const [like, setLike] = useState(data?.likes?.find((id) => id === userInfo?.userId) ? true : false)
  if (!load && data) {
    const selectedProduct: IProduct = data
    return (
      <>
        <main className={styles.detail}>
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.container}>
            <Success err={succed} msg={msg} setErr={setSucced} />
            <Error err={error} msg={msg} setErr={setErr} />
            <section className={styles.characteris}>
              <h3>
                {selectedProduct ? selectedProduct.name : "Apple iPhone 14"}{" "}
              </h3>
              <div className={styles.characterisInfo}>
                <div className={styles.leftSide}>
                  <button className={styles.selectedImage}>
                    <Image
                      src={
                        selectedProduct && selectedProduct?.media.length
                          ? selectedImage === ""
                            ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedProduct?.media[0]?.name}`
                            : `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedImage}`
                          : "/images/noImg.jpg"
                      }
                      style={{
                        borderRadius: 15,
                      }}
                      alt="iphone 14"
                      width={653}
                      height={760}
                    />
                  </button>
                  <div
                    className={styles.imagesToSelect}>
                    {selectedProduct.media.length !== 0 ? selectedProduct.media.map((e: any) => {
                      return (
                        <div
                          key={e.id}
                          className={styles.imageToSelect}
                          style={
                            e.name === selectedImage
                              ? {
                                boxShadow:
                                  "0px 1px 17px rgba(228, 183, 23, 0.3)",
                              }
                              : {}
                          }
                          onClick={() => {
                            setSelectedImage(e.name);
                          }}
                        >
                          <Image
                            src={
                              selectedProduct
                                ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.name}`
                                : "/images/smphone.png"
                            }
                            alt={
                              selectedProduct
                                ? selectedProduct.name
                                : "another phone image"
                            }
                            width={200}
                            height={240.5}
                          />
                        </div>
                      );
                    }) : <div
                      className={styles.imageToSelect}
                    >
                      <p>Rasm topilmadi</p>
                    </div>}
                  </div>
                </div>

                <Order
                  deliveryTo=""
                  products={[{
                    id: selectedProduct.id as string,
                    sum: selectedProduct.price[0].price,
                    qty: 1
                  }]}
                  order={order}
                  setOrder={setOrder}
                />
                <div className={styles.characterSide}>
                  {
                    data && data?.props.map(prop => {
                      return <div className={styles.characterInfo} key={prop.id}>
                        <h4>{prop.name}</h4>
                        {prop.label === "select" ? prop.values.map((e, index) => {
                          return <StorageButton selectedMemory={selectedMemory} key={e.id} setControllerM={setControllerM} setSelectedMemory={setSelectedMemory} e={e} index={index} />
                        }) : prop.values.map(prs => {
                          return <p key={prs.id}>{prs.value === "true" ? "Да" : prs.value === "false" ? "Нет" : prs.value}</p>
                        })}
                      </div>
                    })
                  }
                </div>
                <div className={styles.costSide}>
                  <div className={styles.costTop}>
                    <div className={styles.cost}>
                      {selectedProduct &&
                        <div className={styles.costP} key={`${selectedProduct.id}${Math.random}`}>
                          <h3>{selectedProduct.price[0].price} сум</h3>
                          {selectedProduct.price[0].oldPrice && <h4
                            style={{
                              textDecoration: "line-through",
                            }}
                          >
                            {selectedProduct.price[0].oldPrice} сум
                          </h4>}
                        </div>}
                      <div
                        className={styles.like}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (userInfo) {
                            setLike(!like)
                            axios.put<IProduct>(`${process.env.NEXT_PUBLIC_API}/api/products/like/${searchParams.id}`, {}, {
                              headers: {
                                Authorization: userInfo.userToken
                              }
                            })
                          } else {
                            push("/auth/login")
                          }
                        }}
                      >
                        {like === true ? <svg className={styles.like} width={35} height={35} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" strokeWidth="0.9120000000000001"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#f00"></path> </g></svg> : <svg className={styles.like} width={35} height={35} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" strokeWidth="0.9120000000000001"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#ffffff00"></path> </g></svg>}
                      </div>
                    </div>
                    <div className={styles.buy}>
                      <button
                        type="button"
                        onClick={() => {
                          if (userInfo) {
                            setOrder(true);
                          } else {
                            push("/auth/login")
                          }
                        }}
                      >
                        Sotib olish
                      </button>
                      <div onClick={() => {
                        if (userInfo) {
                          axios
                            .put(
                              `${process.env.NEXT_PUBLIC_API}/api/users/basket/add/${selectedProduct.id}`,
                              {},
                              {
                                headers: {
                                  Authorization: userInfo.userToken,
                                },
                              }
                            )
                            .then((res) => {
                              setAddedToCart(!addedToCart);
                              setSucced(!succed);
                              setMsg("Added to cart");
                            })
                            .catch((err) => {
                              setErr(!error)
                              setMsg(err.response.data.errors[0].message)
                            });
                        } else {
                          push("/auth/login")
                        }
                      }} className={styles.addCart}>
                        <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 2L4.19529 2.37995L5.21167 14.4889C5.29293 15.4778 6.11933 16.2367 7.11143 16.2335H18.6251C19.5718 16.2356 20.375 15.539 20.509 14.6018L21.5106 7.68031C21.6225 6.90668 21.0853 6.18899 20.3127 6.07712C20.2452 6.06762 4.5478 6.06234 4.5478 6.06234" stroke="#E4B717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.0059 9.96309H16.9326" stroke="#E4B717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.64837 19.8922C6.96606 19.8922 7.22252 20.1498 7.22252 20.4664C7.22252 20.7841 6.96606 21.0416 6.64837 21.0416C6.33069 21.0416 6.07422 20.7841 6.07422 20.4664C6.07422 20.1498 6.33069 19.8922 6.64837 19.8922Z" fill="#E4B717" stroke="#E4B717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.5536 19.8922C18.8713 19.8922 19.1289 20.1498 19.1289 20.4664C19.1289 20.7841 18.8713 21.0416 18.5536 21.0416C18.236 21.0416 17.9795 20.7841 17.9795 20.4664C17.9795 20.1498 18.236 19.8922 18.5536 19.8922Z" fill="#E4B717" stroke="#E4B717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartBottom}>
                    <button
                      onClick={() => {
                        if (userInfo !== undefined) {
                          socket.connect()
                          socket.emit('newUser', JSON.stringify({ id: userInfo.userId, fullName: `${localStorage.getItem("userName")} ${localStorage.getItem("lastName")}` }))
                          axios.post(`${process.env.NEXT_PUBLIC_API}/api/chats/new`, {
                            admin: typeof data.author === "string" ? data.author : data.author.id,
                            product: data.id
                          }, {
                            headers: {
                              Authorization: userInfo.userToken
                            }
                          }).then(res => {
                            setChat(res.data)
                            push(`/chats/chat-with-admin?id=${res.data.id}`);
                          })
                        } else {
                          push("/auth/login")
                          setFromWhere(2);
                        }
                      }}
                      className={styles.cart}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="49" height="44" viewBox="0 0 49 44" fill="none">
                        <path d="M18.1415 31.6448C25.6822 31.2257 31.6675 24.9791 31.6675 17.3337C31.6675 9.41743 25.25 3 17.3337 3C9.41743 3 3 9.41743 3 17.3337C3 20.1544 3.81449 22.7846 5.22147 25.0023L4.20848 28.041L4.20685 28.0456C3.81889 29.2095 3.62481 29.7919 3.76298 30.1794C3.88341 30.5169 4.15074 30.7833 4.48844 30.9037C4.87466 31.0413 5.45286 30.8488 6.60897 30.4632L6.62543 30.4584L9.66528 29.4453C11.8829 30.8524 14.5132 31.667 17.3339 31.667C17.6049 31.667 17.8742 31.6596 18.1415 31.6448ZM18.1415 31.6448C18.1413 31.6441 18.1417 31.6452 18.1415 31.6448ZM18.1415 31.6448C20.1028 37.2239 25.4182 41.2238 31.6677 41.2238C34.4883 41.2238 37.1183 40.4082 39.3358 39.0011L42.3748 40.0142L42.3807 40.0154C43.5446 40.4032 44.1278 40.5976 44.5153 40.4595C44.8531 40.3391 45.117 40.0728 45.2374 39.7352C45.3758 39.347 45.1823 38.7641 44.7931 37.5971L43.7802 34.5581L44.1194 33.9957C45.3175 31.9013 46 29.4751 46 26.8896C46 18.9733 39.5837 12.5558 31.6675 12.5558L31.1309 12.5657L30.8602 12.5789" stroke="#E4B717" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Yetkazib beruvchiga yozish
                    </button>
                    <Link className={styles.cart} href={`tel: +${String(data?.vendorId?.contacts?.phoneNumber)}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="49" height="43" viewBox="0 0 49 43" fill="none">
                        <path d="M44.5455 0H17.8182C15.3682 0 13.3636 2.00455 13.3636 4.45455V8.90909C6.01364 8.90909 0 14.9227 0 22.2727V35.6364H4.45455C4.45455 39.327 7.44577 42.3182 11.1364 42.3182C14.827 42.3182 17.8182 39.327 17.8182 35.6364H26.7273C26.7273 39.327 29.7185 42.3182 33.4091 42.3182C37.0997 42.3182 40.0909 39.327 40.0909 35.6364H44.5455C46.9955 35.6364 49 33.6318 49 31.1818V4.45455C49 2.00455 46.9955 0 44.5455 0ZM11.1364 37.8636C9.90802 37.8636 8.90909 36.8647 8.90909 35.6364C8.90909 34.408 9.90802 33.4091 11.1364 33.4091C12.3647 33.4091 13.3636 34.408 13.3636 35.6364C13.3636 36.8647 12.3647 37.8636 11.1364 37.8636ZM13.3636 29.3432C12.6665 29.096 11.9181 28.9545 11.1364 28.9545C9.15966 28.9545 7.38898 29.8176 6.1662 31.1818H4.45455V24.5H13.3636V29.3432ZM13.3636 20.0455H4.74743C5.7408 16.209 9.22091 13.3636 13.3636 13.3636V20.0455ZM33.4091 37.8636C32.1808 37.8636 31.1818 36.8647 31.1818 35.6364C31.1818 34.408 32.1808 33.4091 33.4091 33.4091C34.6374 33.4091 35.6364 34.408 35.6364 35.6364C35.6364 36.8647 34.6374 37.8636 33.4091 37.8636ZM44.5455 31.1818H38.3793C37.1554 29.8176 35.3858 28.9545 33.4091 28.9545C31.4324 28.9545 29.6617 29.8176 28.4389 31.1818H17.8182V4.45455H44.5455V31.1818Z" fill="#E4B717" />
                      </svg>
                      +{data && String(data?.vendorId?.contacts?.phoneNumber)!}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            {selectedProduct && selectedProduct.video ? (
              <section className={styles.video}>
                <div className={styles.hole}>
                  <video
                    controls
                    ref={videoRef}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedProduct.video.name}`}
                  />
                </div>
              </section>
            ) : null}
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 5</SwiperSlide>
              <SwiperSlide>Slide 6</SwiperSlide>
              <SwiperSlide>Slide 7</SwiperSlide>
              <SwiperSlide>Slide 8</SwiperSlide>
              <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper>
            <section className={styles.detailSelected}>
              <>
                <h3>Tavsif</h3>
                <div className={styles.info}>
                  <p
                    style={{
                      color: "#888888",
                      lineHeight: "25.6px",
                    }}
                  >
                    {selectedProduct
                      && selectedProduct.description.substring(0, textLength)}
                    {selectedProduct &&
                      selectedProduct.description.length > 1000 && (
                        <button
                          onClick={() => {
                            setTextLength(selectedProduct?.description.length);
                          }}
                          style={
                            textLength !== selectedProduct?.description.length
                              ? {
                                color: "#179AE4",
                                fontWeight: 700,
                              }
                              : {
                                display: "none",
                              }
                          }
                        >
                          [ko'proq o'qish]
                        </button>
                      )}
                  </p>
                </div>
              </>
            </section>
          </div>
        </main>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Detail);
