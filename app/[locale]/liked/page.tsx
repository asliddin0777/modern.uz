"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/liked.module.css";
import Header from "../components/global/Header";
import Buy from "@/public/images/Buy.png";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/global/Footer";
import TopHeader from "../components/global/TopHeader";
import Categories from "../components/global/Categories";
import Card from "../components/global/Card";
import { useRouter } from "next/router";
import Loader from "../components/local/Loader";
import { Cookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid"
import axios from "axios";

interface Like {
  like: any;
  setLike: Function
}

const cookies = new Cookies()
const Liked = ({like, setLike}: Like) => {
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true)
  useEffect(() => {
    setLoad(true)
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`)
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`)
        const [res1, res2] = await axios.all([categories, subCategories])
        setCategories(res1.data)
        setSubCategories(res2.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false)
      }
    }
    fetchData()
  }, [])

  if (likedObj && load === false) {
    return (
      <div className={styles.liked}>
        <TopHeader />
        <Header />
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.Favorites}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Избранное</h1>
        </div>
        <section className={styles.likedSection}>
          <div className={styles.newProductsWrapper}>
            {likedObj.map((card:any, index:any) => {
              return (
                <Card
                  url={index}
                  title={card.title}
                  image={card.image}
                  width={card.width}
                  height={card.height}
                  price={card.price}
                  cat={card.cat}
                  key={uuidv4()}
                  animation=""
                  likedObj={likedObj}
                  setLikedObj={setLikedObj}
                  isLiked
                />
              );
            })}
          </div>
        </section>
        <div style={{ marginTop: "11rem" }}>
          <Footer />
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Liked;