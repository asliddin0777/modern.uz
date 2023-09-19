"use client";
import Head from "next/head";
import styles from "@/styles/index.module.css";
import Categories from "./components/global/Categories";
import Image from "next/image";
import Card from "./components/global/Card";
import Footer from "./components/global/Footer";
import { useState, useEffect, memo } from "react";
import HeaderTabs from "./components/local/HeaderTabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import "swiper/css/pagination";
import axios from "axios";
import Loader from "./components/local/Loader";
import { IPage } from "@/interfaces/IPage";
import { usePathname } from "next/navigation";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../[locale]/components/local/socket";
import IProduct from "@/interfaces/Product/IProduct";
import Auth from "./components/global/Auth";
import ChatWithVendor from "./components/local/ChatWithVendor";

const Home = ({
  searchParams,
}: {
  searchParams: {
    id: string;
  };
}) => {
  const [buttonColor, setButtonColor] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(4);
  const [data, setData] = useState<IPage>();
  const [popularProducts, setPopularProducts] = useState<any[] | any>([]);
  const [slides, setSlides] = useState<any[] | any>([]);
  const { push } = useRouter();
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [vendorCard, setVendorCard] = useState<any[] | any>([]);
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [vendor, setVendor] = useState<any[] | any>([]);
  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chat, setChat] = useState();
  const [iprod, setIprod] = useState<IProduct>();

  const pathname = usePathname();
  console.log(pathname);
  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;

  const [refetch, setRefetch] = useState(false);

  console.log("wefwe");

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const req1 = axios.get<IPage>(
          `${process.env.NEXT_PUBLIC_API}/api/products`
        );
        const req2 = axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const req3 = axios.get(`${process.env.NEXT_PUBLIC_API}/api/slides`);
        const req4 = axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/products?popularProducts=true`
        );
        const req5 = axios.get(`${process.env.NEXT_PUBLIC_API}/api/vendors`);
        const req6 = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const [res, res1, res2, res3, res4, res5] = await axios.all([
          req1,
          req2,
          req3,
          req4,
          req5,
          req6,
        ]);
        setData(res.data);
        setCategories(res1.data);
        setSlides(res2.data);
        setPopularProducts(res3.data);
        setVendor(res4.data);
        setSubCategories(res5.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (refetch === true) {
      setData({ page: 1, products: [], totalCount: 3 });
      setPopularProducts({});
      const refetchData = async () => {
        try {
          const prod = axios.get<IPage>(
            `${process.env.NEXT_PUBLIC_API}/api/products`
          );
          const iprod = await axios.get<IProduct>(
            `${process.env.NEXT_PUBLIC_API}/api/products/${searchParams.id}`
          );
          const pop = axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/products?popularProducts=true`
          );
          const [product, popular] = await axios.all([prod, pop]);
          setData(product.data);
          setPopularProducts(popular.data);
        } catch (err) {
          console.log(err);
        }
      };
      refetchData();
      setRefetch(false);
    }
  }, [refetch]);

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/vendors/`)
      .then((res: any) => {
        setVendorCard(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  }, []);

  useEffect(() => {
    document.body.offsetWidth < 680 && document.body.offsetWidth > 460
      ? setSlidesPerView(3)
      : document.body.offsetWidth < 460
      ? setSlidesPerView(2)
      : setSlidesPerView(4);
  }, []);

  useEffect(() => {
    document.body.offsetWidth < 680 && document.body.offsetWidth > 460
      ? setSlidesPerView(3)
      : document.body.offsetWidth < 460
      ? setSlidesPerView(2)
      : setSlidesPerView(4);
  }, []);

  const pagination: object = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  if (load === true) {
    return <Loader />;
  } else {
    return (
      <>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.home}>
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.container}>
            <HeaderTabs
              setButtonColor={setButtonColor}
              buttonColor={buttonColor}
            />
            {buttonColor === 0 ? (
              <>
                <div>
                  <Swiper
                    pagination={pagination}
                    modules={[Pagination]}
                    className={styles.add}
                  >
                    {slides &&
                      slides.map((e: any) => {
                        return (
                          <SwiperSlide key={e.id} className={styles.addItem}>
                            <Link
                              href={
                                e.productId
                                  ? `/product/${e.productId}`
                                  : `/company/${e.vendorId}`
                              }
                              className={styles.addLeft}
                            >
                              <h1>{e.title}</h1>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${e.image.name}`}
                                alt="iphone image"
                                width={308}
                                height={410}
                              />
                              <div className={styles.controller}>
                                {[1, 2, 3, 4].map((j: number) => {
                                  return (
                                    <div
                                      key={`${e.id}${j}`}
                                      className={styles.circle}
                                    />
                                  );
                                })}
                              </div>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                  </Swiper>
                </div>
                {categories && (
                  <div className={styles.categories}>
                    <h3
                      style={{
                        fontSize: 23,
                      }}
                    >
                      Категории для вас
                    </h3>
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={slidesPerView}
                      className={styles.swiperL}
                      modules={[Navigation]}
                      navigation={true}
                    >
                      {categories.map((val: any) => {
                        return (
                          <SwiperSlide
                            key={val.id}
                            className={styles.categoriesSlide}
                          >
                            <Link
                              className={styles.categoryItem}
                              href={`/category/${val.id.toLocaleLowerCase()}`}
                            >
                              <div className={styles.categoriesTop}>
                                {val.icon ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${val.icon?.name}`}
                                    width={52}
                                    height={51}
                                    alt="home icon"
                                  />
                                ) : (
                                  <h5>No image</h5>
                                )}
                              </div>
                              <h3>{val.name}</h3>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}
                {data && data.products.length ? (
                  <section className={styles.newProducts}>
                    <h3>Новые продукты</h3>
                    <div className={styles.newProductsWrapper}>
                      {refetch === true ? (
                        <>
                          <div className={styles.loading}>
                            <Loader />
                          </div>
                        </>
                      ) : (
                        data?.products?.map((e: any, index: number) => {
                          return (
                            <Card
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
                                  : "/icons/bag.svg"
                              }
                              title={e.name}
                              price={e.price[0].price}
                              key={e.id}
                              isLiked
                              likedObj={likedObj}
                              setLikedObj={setLikedObj}
                            />
                          );
                        })
                      )}
                    </div>
                    {data && data.products.length > 9 && (
                      <button className={styles.loadMore}>
                        Посмотреть больше
                      </button>
                    )}
                    <section className={styles.newProducts}>
                      <h3>Популярные продукты</h3>
                      <div className={styles.newProductsWrapper}>
                        {popularProducts &&
                          popularProducts.products?.map(
                            (card: any, index: number) => {
                              return (
                                <Card
                                  animation="fade-down"
                                  cat={card.subcategory.name}
                                  url={card.id}
                                  height={300}
                                  width={300}
                                  image={
                                    card.media.length
                                      ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${card.media[0]?.name}`
                                      : "/icons/bag.svg"
                                  }
                                  title={card.name}
                                  price={card.price[0].price}
                                  key={card.id}
                                  isLiked
                                  setData={setRefetch}
                                  card={card}
                                  likedObj={likedObj}
                                  setLikedObj={setLikedObj}
                                />
                              );
                            }
                          )}
                      </div>
                      {popularProducts &&
                        popularProducts.products.length > 9 && (
                          <button className={styles.loadMore}>
                            Посмотреть больше
                          </button>
                        )}
                    </section>
                  </section>
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
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
                {vendorCard &&
                  vendorCard.map((e: any, index: number) => {
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
                            <Image
                              src={"/icons/profile.svg"}
                              height={57}
                              width={57}
                              alt="profile"
                            />
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
                            <button
                              onClick={() => {
                                push(`/company/${e.name}?id=${e.id}`);
                              }}
                            >
                              Посмотреть все товары
                            </button>
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
                                      `/chats/new`,
                                      {
                                        author: iprod?.author.id,
                                        product: iprod?.id,
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
                              <p>Chat</p>
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
              </>
            )}
          </div>
        </main>
      </>
    );
  }
};

export default memo(Home);
