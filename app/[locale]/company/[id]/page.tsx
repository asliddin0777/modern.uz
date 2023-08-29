"use client"

import React from "react";
import styles from "@/styles/company.module.css";
import TopHeader from "../../components/global/TopHeader";
import Header from "../../components/global/Header";
import Categories from "../../components/global/Categories";
import Image from "next/image";
import { useState, useEffect } from "react";
import Card from "../../components/global/Card";
import Footer from "../../components/global/Footer";
import Link from "next/link";
import axios from "axios";
import { uuid as uuidv4 } from 'uuidv4';
import Loader from "../../components/local/Loader";
import {  useRouter, usePathname } from "next/navigation";

const Company = () => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [likedObj, setLikedObj] = useState([])
  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`);
        const data = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/vendors`);
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
  const [nav, setNav] = useState<number>(0);
  const [data, setData] = useState<object[] | any>([]);
  const { id }: any = useRouter();
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
    {
      image: "/images/smphone.png",
      w: 160,
      h: 173,
      title: "Samsung M53",
      price: "4.000.000 сум",
      cat: "Телефоны",
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
      image: "/images/xboxController.png",
      w: 181,
      h: 192,
      title: "Xbox",
      price: "7.000.000 сум",
      cat: "Приставки",
    },
    {
      image: "/images/productPhone.png",
      w: 144,
      h: 167,
      title: "Iphone 14 PRO",
      price: "13.000.000 сум",
      cat: "Телефоны",
    },
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
    {
      image: "/images/smphone.png",
      w: 160,
      h: 173,
      title: "Samsung M53",
      price: "4.000.000 сум",
      cat: "Телефоны",
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
      image: "/images/xboxController.png",
      w: 181,
      h: 192,
      title: "Xbox",
      price: "7.000.000 сум",
      cat: "Приставки",
    },
    {
      image: "/images/productPhone.png",
      w: 144,
      h: 167,
      title: "Iphone 14 PRO",
      price: "13.000.000 сум",
      cat: "Телефоны",
    },
  ];

  if (load === false && data) {
    const selectedVendor = data.find((vendor: any) => vendor.id === id);
    return (
      <div className={styles.company}>
        <TopHeader />
        <Header />
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          <section className={styles.companyTitle}>
            <div className={styles.companyProfile}>
              <div className={styles.profileSection}>
                {" "}
                <Image
                  src={"/profile.svg"}
                  width={57}
                  height={57}
                  alt="profile"
                />
                <div className={styles.profile}>
                  <h1>
                    {selectedVendor
                      ? selectedVendor.name
                      : "Shenzhen Qingmai Bicycle Co., Ltd."}
                  </h1>
                  <p>Мужское</p>
                </div>
              </div>
              <a
                href={
                  selectedVendor
                    ? `tel: ${selectedVendor.contacts.phoneNumber}`
                    : "#"
                }
                type="button"
              >
                Связаться
              </a>
            </div>
            <div className={styles.companyDescrip}>
              <p>Описание</p>
              <p>
                {selectedVendor
                  ? selectedVendor.description
                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
            </div>
          </section>
          <section className={styles.companyCards}>
            <h2>Товары поставщика</h2>
            <div className={styles.card}>
              {selectedVendor
                ? selectedVendor.products.map((e: any, index: number) => {
                    return (
                      <Card
                        url={`${index}`}
                        animation="zoom-in"
                        image={e.image}
                        width={300}
                        height={300}
                        title={e.title}
                        price={e.price}
                        cat={e.cat}
                        key={uuidv4()}
                        isLiked
                        setLikedObj={setLikedObj}
                        likedObj={likedObj}
                      />
                    );
                  })
                : cardObj.map((card, index) => {
                    return (
                      <Card
                        url={`${index}`}
                        animation="zoom-in"
                        image={card.image}
                        width={card.w}
                        height={card.h}
                        title={card.title}
                        price={card.price}
                        cat={card.cat}
                        isLiked
                        setLikedObj={setLikedObj}
                        likedObj={likedObj}
                        key={uuidv4()}
                      />
                    );
                  })}
            </div>
          </section>
          <div className={styles.carusel}>
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
          </div>
        </div>
        <Footer />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Company;
