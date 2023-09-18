"use client";
import Head from "next/head";
import styles from "@/styles/index.module.css";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Categories from "./components/global/Categories";
import Image from "next/image";
import Card from "./components/global/Card";
import Footer from "./components/global/Footer";
import { useState, useEffect, useContext } from "react";
import HeaderTabs from "./components/local/HeaderTabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { uuid as uuidv4 } from "uuidv4";
import Loader from "./components/local/Loader";
import { IPage } from "@/interfaces/IPage";
import { CartContext } from "./layout";

export default function Home() {
  const [buttonColor, setButtonColor] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(4);
  const [data, setData] = useState<IPage>();
  const [popularProducts, setPopularProducts] = useState<any[] | any>([]);
  const [slides, setSlides] = useState<any[] | any>([]);
  const [isLiked, setIsLiked] = useState<any[] | any>([]);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [vendorCard, setVendorCard] = useState<any[] | any>([]);
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [vendor, setVendor] = useState<any[] | any>([]);
  const router = useRouter();

  const objCard = [
    {
      price: "300.00.00",
      title: "Iphone 14 pro",
      width: 95,
      height: 113,
      image: "/icons/phone.svg",
      cat: "Телефоны",
    },
    {
      price: "300.00.00",
      title: "Iphone 14 pro",
      width: 95,
      height: 113,
      image: "/icons/phone.svg",
      cat: "Телефоны",
    },
    {
      price: "300.00.00",
      title: "Iphone 14 pro",
      width: 95,
      height: 113,
      image: "/icons/phone.svg",
      cat: "Телефоны",
    },
  ];

  const [refetch, setRefetch] = useState(false);

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
          <TopHeader />
          <Header />
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
                          <SwiperSlide
                            key={uuidv4()}
                            className={styles.addItem}
                          >
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
                                {[1, 2, 3, 4].map((e: number) => {
                                  return (
                                    <div
                                      key={uuidv4()}
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
                            key={uuidv4()}
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
                              key={uuidv4()}
                              isLiked
                              likedObj={likedObj}
                              setLikedObj={setLikedObj}
                            />
                          );
                        })
                      )}
                    </div>
                    <button className={styles.loadMore}>
                      Посмотреть больше
                    </button>
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
                                  key={uuidv4()}
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
                      <button className={styles.loadMore}>
                        Посмотреть больше
                      </button>
                    </section>
                  </section>
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
                {vendorCard &&
                  vendorCard.map((e: any, index: number) => {
                    return (
                      <div className={styles.cards} key={uuidv4()}>
                        <div className={styles.card__left}>
                          <Link
                            style={{
                              color: "#000",
                            }}
                            href={`/company${e}`}
                            className={styles.card__title}
                          >
                            <Image
                              src={"/icons/profile.svg"}
                              height={57}
                              width={57}
                              alt="profile"
                            />
                            <div>
                              <h3>{e.contacts.phoneNumber}</h3>
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
                                router.push(`/company/${e}`);
                              }}
                            >
                              Посмотреть все товары
                            </button>
                            <button>Связаться</button>
                          </div>
                          <div className={styles.carusel__card}>
                            {/* {vendorCard &&
                              vendorCard.map((e: any, index: number) => {
                                return (
                                  <div className={styles.vendorCards}>
                                    <h4>{e.name}</h4>
                                    
                                    <h1>{e.products}</h1>
                                  </div>
                                );
                              })} */}
                            {/* <section className={styles.controllerProduct}>
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
                        </section> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                <div className={styles.carusel}>
                  <div
                    style={{
                      backgroundColor: "#E4B717",
                      width: 39,
                      height: 39,
                      borderRadius: "100%",
                      color: "#fff",
                      textAlign: "center",
                      paddingTop: 8,
                    }}
                  >
                    <p>1</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <Footer />
        </main>
      </>
    );
  }
}
