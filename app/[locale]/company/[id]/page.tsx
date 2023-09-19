"use client"

import React, { memo } from "react";
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
import Loader from "../../components/local/Loader";
import { useRouter, usePathname } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";

const Company = ({ searchParams }: {
  searchParams: {
    id: string
  }
}) => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [refetch, setRefetch] = useState(false)
  const [load, setLoad] = useState<boolean>(true);
  const [likedObj, setLikedObj] = useState(false)
  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`);
        const data = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/vendors/${searchParams.id}`);
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

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }

  if (load === false) {
    return (
      <div className={styles.company}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          <section className={styles.companyTitle}>
            <div className={styles.companyProfile}>
              <div className={styles.profileSection}>
                {" "}
                <div className={styles.profileImage} style={{
                  background: `${getRandomColor()}`
                }}>{data.name[0]}</div>
                <div className={styles.profile}>
                  <h1>
                    {data
                      ? data.name
                      : "Shenzhen Qingmai Bicycle Co., Ltd."}
                  </h1>
                </div>
              </div>
              <a
                href={
                  data
                    ? `tel: +${data.contacts.phoneNumber}`
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
                {data
                  ? data.description
                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
            </div>
          </section>
          <section className={styles.companyCards}>
            {data && data.products.length > 0 && <h2>Товары поставщика</h2>}
            {data && data.products && data.products.map((e: IProduct) => {
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
                      : "/icons/bag.svg"
                  }
                  title={e.name}
                  price={String(e.price[0].price)}
                  key={e.id}
                />
              )
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
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Company);
