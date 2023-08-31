"use client"
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import TopHeader from "../../components/global/TopHeader";
import Header from "../../components/global/Header";
import Categories from "../../components/global/Categories";
import styles from "@/styles/detail.module.css";
import Image from "next/image";
import Footer from "../../components/global/Footer";
import Card from "../../components/global/Card";
import Reviews from "../../components/local/Reviews";
import Chat from "../../components/local/Chat";
import Order from "../../components/global/Order";
import { usePathname } from "next/navigation";
import axios from "axios";
import Loader from "../../components/local/Loader";
import { io } from "socket.io-client";
import { uuid as uuidv4 } from 'uuidv4';
import { userInfo } from "os";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../../components/local/socket";
import IProduct from "@/interfaces/Product/IProduct";
import IReview from "@/interfaces/Review/IReview";
import Auth from "../../components/global/Auth";


const Detail = () => {
  const [likedObj, setLikedObj] = useState<any | any[]>([]);
  const [controllerC, setControllerC] = useState<number>(0);
  const [controllerM, setControllerM] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [textLength, setTextLength] = useState<number>(1000);
  const [data, setData] = useState<any | any[]>([]);
  const [props, setProps] = useState<any | any[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [categories, setCategories] = useState<any[] | any>([])
  const [subCategories, setSubCategories] = useState<any[] | any>([])
  const [auth, setAuth] = useState<boolean>(false)
  const [fromWhere, setFromWhere] = useState<number>(0)
  const pathname = usePathname();

  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  useEffect(() => {
    order !== true
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  }, [order]);
  useEffect(() => {
    isChatOpen !== true
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  }, [isChatOpen]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const req1 = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products`)
        const req2 = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/props`)
        const req3 = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`)
        const req4 = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`)
        const [res1, res2, res3, res4] = await axios.all([req1, req2, req3, req4])
        setData(res1.data.products)
        setProps(res2.data)
        setCategories(res3.data)
        setSubCategories(res4.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoad(false)
      }
    }
    fetchData()
  }, [])

  const cardObj = [
    {
      image: "/images/productPhone.png",
      w: 144,
      h: 167,
      title: "Iphone 14 PRO",
      price: "13.000.000 сум",
      cat: "Телефоны",
    },
    {
      image: "/images/xboxController.png",
      w: 181,
      h: 192,
      title: "Xbox",
      price: "7.000.000 сум",
      cat: "Приставки",
    },
    {
      image: "/images/headPhone.png",
      w: 179,
      h: 190,
      title: "Наушники SONY",
      price: "300.000 сум",
      cat: "Аксессуары",
    },
    {
      image: "/images/smphone.png",
      w: 160,
      h: 173,
      title: "Samsung M53",
      price: "4.000.000 сум",
      cat: "Телефоны",
    },
  ];
  const videoRef = useRef<HTMLVideoElement | any>();

  const desc =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";

  if (!load) {
    const selectedProduct: IProduct =
      data && data.find((product: any) => product.id === pathname.split("/")[pathname.split("/").length - 1]);
    const storage = selectedProduct?.props.filter(
      (st: any) => st.prop.name === "Storage"
    );
    const colors: any = selectedProduct?.props.filter(
      (st: any) => st.prop.name === "Color"
    );
    const warranty: any = selectedProduct?.props.find(
      (wr: any) => wr.prop.name === "Warranty"
    );
    const manif: any = selectedProduct?.props.find(
      (mf: any) => mf.prop.name === "Manufacturer"
    );
    const wtRs: any = selectedProduct?.props.find(
      (wtrs: any) => wtrs.prop.name === "Water Resistance"
    );
    let checkWtRs;
    if (wtRs) {
      let checkWtR = Boolean(wtRs?.value);
      checkWtRs = checkWtR;
    }
    return (
      <>
        <Head>
          <title>{selectedProduct?.name} - Page</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
          />
        </Head>
        <main className={styles.detail}>
          <TopHeader />
          <Header />
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.container}>
            <section className={styles.characteris}>
              <h3>
                {selectedProduct ? selectedProduct.name : "Apple iPhone 14"}{" "}
                {selectedMemory}
              </h3>
              <div className={styles.characterisInfo}>
                <div className={styles.leftSide}>
                  <button className={styles.selectedImage}>
                    <Image
                      src={
                        selectedProduct && selectedProduct?.media.length
                          ? selectedImage === "" ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedProduct?.media[0]?.name}` : `${process.env.NEXT_PUBLIC_IMAGE_API}/${selectedImage}`
                          : "/images/bag.png"
                      }
                      style={{
                        borderRadius: 15
                      }}
                      alt="iphone 14"
                      width={353}
                      height={460}
                    />
                  </button>
                  <div className={styles.imagesToSelect}>
                    {selectedProduct?.media.map((e, index) => {
                      return (
                        <div
                          key={uuidv4()}
                          className={styles.imageToSelect}
                          style={
                            e.name === selectedImage
                              ? {
                                boxShadow:
                                  "0px 1px 17px rgba(228, 183, 23, 0.3)",
                              }
                              : {}
                          }
                          onClick={()=> {
                            setSelectedImage(e.name)
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
                            width={71}
                            height={84.5}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Order
                  selectedProduct={selectedProduct}
                  order={order}
                  setOrder={setOrder}
                />
                <div className={styles.characterSide}>
                  <div className={styles.character}>
                    <div className={styles.characterInfo}>
                      <div className={styles.characterInfoLeft}>
                        {warranty && (
                          <p>Гарантия.................................</p>
                        )}
                        {manif && <p>Производитель......................</p>}
                        {wtRs && <p>Водонепроницаемый...........</p>}
                        {selectedColor !== "" && <p>Цвет.........................................</p>}
                      </div>
                      <div className={styles.characterInfoRight}>
                        {warranty && <p>{warranty.value}</p>}
                        {manif && <p>{manif.value}</p>}
                        {wtRs && <p>{checkWtRs ? "Да" : "Нет"}</p>}
                        {selectedColor !== "" && <p>{selectedColor}</p>}
                      </div>
                    </div>
                    {isChatOpen === true && <Chat selectedProduct={selectedProduct} setIsChatOpen={setIsChatOpen} />}
                    {auth === true && <Auth setIsAuthOpen={setAuth} fromWhere={fromWhere} isAuthOpen={auth} setFromWhere={setFromWhere} />}
                    <div className={styles.selectMemory}>
                      {colors &&
                        colors.map((e: any, index: number) => {
                          return (
                            <button
                              type="button"
                              key={uuidv4()}
                              className={
                                selectedColor === e.value
                                  ? styles.memoryd
                                  : styles.memory
                              }
                              onClick={() => {
                                setControllerM(index);
                                setSelectedColor(e.value);
                              }}
                            >
                              {e.value}
                            </button>
                          );
                        })}
                    </div>
                    <div className={styles.selectMemory}>
                      {storage &&
                        storage.map((e: any, index: number) => {
                          return (
                            <button
                              type="button"
                              key={uuidv4()}
                              className={
                                selectedMemory === e.value
                                  ? styles.memoryd
                                  : styles.memory
                              }
                              onClick={() => {
                                setControllerM(index);
                                if (e.value === selectedMemory) {
                                  setSelectedMemory("")
                                } else {
                                  setSelectedMemory(e.value);
                                }
                              }}
                            >
                              {e.value}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className={styles.costSide}>
                  <div className={styles.costTop}>
                    <div className={styles.cost}>
                      {selectedProduct && selectedProduct.price.map((price: any) => {
                        return <div className={styles.costP} key={uuidv4()}>
                          <h3>{price.price} $</h3>
                          <h4
                            style={{
                              textDecoration: "line-through",
                            }}
                          >
                            {price.oldPrice}
                          </h4>
                        </div>
                      })}
                      <div className={styles.imageLike}>
                        <Image
                          src="/icons/liked.svg"
                          width={23}
                          height={22}
                          alt="like icon"
                        />
                      </div>
                    </div>
                    <div className={styles.buy}>
                      <button
                        type="button"
                        onClick={() => {
                          setOrder(true);
                        }}
                      >
                        Купить
                      </button>
                      <div className={styles.addCart}>
                        <Image
                          src={"/icons/buyY.svg"}
                          alt="add to cart icon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.cartBottom}>
                    <button
                      onClick={() => {
                        if (userInfo !== undefined) {
                          setIsChatOpen(!isChatOpen);
                        socket.connect()
                        socket.emit('newUser', JSON.stringify({id: userInfo.userId, fullName: `${localStorage.getItem("userName")} ${localStorage.getItem("lastName")}`}))
                        axios.post("/chats/new", {
                          author: selectedProduct.author,
                          product: selectedProduct.id
                        }, {
                          headers: {
                            Authorization: userInfo.userToken
                          }
                        })
                        } else {
                          setAuth(!auth)
                          setFromWhere(2)
                        }
                      }}
                      className={styles.cart}
                    >
                      <Image
                        src={"/icons/chat.svg"}
                        alt="chat icon"
                        width={43}
                        height={39}
                      />
                      Написать поставщику
                    </button>
                    <button className={styles.cart}>
                      <Image
                        src={"/icons/deliver.svg"}
                        alt="deliver icon"
                        width={49}
                        height={43}
                      />
                      Доставка
                    </button>
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
            <div className={styles.selectDetail}>
              <button
                className={controllerC === 0 ? styles.selected : styles.select}
                onClick={() => {
                  setControllerC(0);
                }}
              >
                Характеристики
              </button>
              <button
                onClick={() => {
                  setControllerC(1);
                }}
                className={controllerC === 0 ? styles.select : styles.selected}
              >
                Отзывы
              </button>
            </div>
            <section className={styles.detailSelected}>
              {controllerC === 0 ? (
                <>
                  <div className={styles.detailS}>
                    <div className={styles.characterInfo}>
                      <div className={styles.characterInfoLeft}>
                        {warranty && (
                          <p>Гарантия.................................</p>
                        )}
                        {manif && <p>Производитель......................</p>}
                        {wtRs && <p>Водонепроницаемый...........</p>}
                        {selectedColor !== "" && <p>Цвет.........................................</p>}
                      </div>
                      <div className={styles.characterInfoRight}>
                        {warranty && <p>{warranty.value}</p>}
                        {manif && <p>{manif.value}</p>}
                        {wtRs && <p>{checkWtRs ? "Да" : "Нет"}</p>}
                        {selectedColor !== "" && <p>{selectedColor}</p>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.info}>
                    <p
                      style={{
                        color: "#888888",
                        lineHeight: "25.6px",
                      }}
                    >
                      {selectedProduct
                        ? selectedProduct.description.substring(0, textLength)
                        : desc.substring(0, textLength)}{" "}
                      {selectedProduct &&
                        selectedProduct.description.length > 1000 ? (
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
                          [read more]
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setTextLength(desc.length);
                          }}
                          style={
                            textLength !== desc.length
                              ? {
                                color: "#179AE4",
                                fontWeight: 700,
                              }
                              : {
                                display: "none",
                              }
                          }
                        >
                          [read more]
                        </button>
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <div className={styles.reviewsWrapper}>
                  <form className={styles.postReview}>
                    <h3>Оставить отзыв</h3>
                    <input required type="text" />
                  </form>
                  {selectedProduct && selectedProduct?.review?.map((e:IReview) => {
                    return <Reviews key={uuidv4()} />;
                  })}
                </div>
              )}
            </section>
            <section className={styles.similarProducts}>
              <h3>Похожие товары</h3>
              <div className={styles.productWrapper}>
                {cardObj.map((card, index) => {
                  return (
                    <Card
                      isLiked={false}
                      likedObj={likedObj}
                      setLikedObj={setLikedObj}
                      url={`${index}`}
                      title={card.title}
                      image={card.image}
                      width={card.w}
                      height={card.h}
                      price={card.price}
                      cat={card.cat}
                      key={uuidv4()}
                      animation=""
                    />
                  );
                })}
              </div>
              <div className={styles.controllerProduct}>
                <button>
                  <Image
                    src={"/icons/chevronLeft.svg"}
                    alt="chevron left icon"
                    width={11}
                    height={20}
                  />
                </button>
                <button>
                  <Image
                    src={"/icons/chevronRight.svg"}
                    alt="chevron right icon"
                    width={11}
                    height={20}
                  />
                </button>
              </div>
            </section>
          </div>
          <Footer />
        </main>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Detail;
