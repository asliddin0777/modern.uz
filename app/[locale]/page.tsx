"use client";
import styles from "@/styles/index.module.css";
import Categories from "./components/global/Categories";
import Image from "next/image";
import Card from "./components/global/Card";
import { useState, useEffect, cache } from "react";
import HeaderTabs from "./components/local/HeaderTabs";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "./components/local/Loader";
import { IPage } from "@/interfaces/IPage";
import useCookies from "react-cookie/cjs/useCookies";
import socket from "../[locale]/components/local/socket";

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
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [vendor, setVendor] = useState<any[] | any>([]);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;

  const [refetch, setRefetch] = useState(false);

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }

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
        // const [vendor]
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
      } finally {
        setLoad(false);
      }
    }
    fetchData();
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
  console.log(vendor);
  if (load === true) {
    return <Loader />;
  } else {
    return (
      <>
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
                                  ? `/product/${e.title.split(" ").join("-")}?id=${e.productId}`
                                  : `/company/${e.title.split(" ").join("-")}?id=${e.vendorId}`
                              }
                              className={styles.addLeft}
                            >
                              <h1>{e.title}</h1>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${e.image.name}`}
                                alt="iphone image"
                                width={1308}
                                height={1410}
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

                              href={`/category/${val.name}?id=${val.id}`}
                            >
                              <div className={styles.categoriesTop} style={val.icon ? { border: "1px solid #4D4D4D" } : { border: 0 }}>
                                {val.icon ? (
                                  <Image

                                    src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${val.icon?.name}`}
                                    width={500}
                                    height={500}
                                    alt="home icon"
                                  />
                                ) : (
                                  <h5>Нет изображения</h5>
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
                        data?.products?.slice(0, 8).map((e: any, index: number) => {
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
                                  : "/images/noImg.jpg"
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
                    {data && data.products.length > 8 && (
                      <button onClick={()=> {
                        push("/product")
                      }} className={styles.loadMore}>
                        Посмотреть больше
                      </button>
                    )}
                    <section className={styles.newProducts}>
                      <h3>Популярные продукты</h3>
                      <div className={styles.newProductsWrapper}>
                        {popularProducts &&
                          popularProducts.products?.slice(0, 8).map(
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
                                      : "/images/noImg.jpg"
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
                        popularProducts.products.length > 8 && (
                          <button onClick={()=> {
                            push("/product?id=popular")
                          }} className={styles.loadMore}>
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
                <div className={styles.vendorsWrapper}>
                  {vendor &&
                    vendor.map((e: any, index: number) => {
                      if (e) {
                        return (
                          <div className={styles.cards} key={e.id}>
                            <Link style={{
                              color: "#000",
                            }}
                              href={`/company/${e.id}`}
                              as={`/company/${e.name.split(" ").join("-")}?id=${e.id}`} className={styles.card__left}>
                              <div
                                className={styles.card__title}
                              >
                               
                                <Image className={styles.profileImage} src={e?.baner ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e?.baner.name}` :"/images/noImg.jpg"} width={1000} height={408} alt="vendor image" />
                                <div>
                                  <h3>{e.name}</h3>
                                </div>
                              </div>
                              {e.description && <div className={styles.description}>
                                <p>Описание</p>
                                <p>{e.description.substring(0, 150)}{e?.description.length > 150 && "..."}</p>
                              </div>}
                            </Link>
                            <div className={styles.card__right}>
                              <div className={styles.cards__button}>
                                <button
                                  onClick={() => {
                                    push(`/company/${e.name.split(" ").join("-")}?id=${e.id}`);
                                  }}
                                >
                                  Посмотреть все товары
                                </button>
                                <div
                                  className={styles.chatButton}
                                  onClick={() => {
                                    socket.connect();
                                    if (userInfo !== undefined && e) {
                                      setIsChatOpen(!isChatOpen);
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
                                            admin: typeof e.admin === "string" ? e.admin : e.admin.id
                                          },
                                          {
                                            headers: {
                                              Authorization: userInfo.userToken,
                                            },
                                          }
                                        )
                                        .then((res) => {
                                          push(`/chats?id=${res.data.id}`)
                                        });
                                    } else {
                                      push("/auth/login")
                                    }
                                  }}
                                >
                                  <svg viewBox="0 0 24.00 24.00" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5" stroke="#000000" strokeWidth="0.792" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </>
            )}
          </div>
        </main>
      </>
    );
  }
};

export default Home;
