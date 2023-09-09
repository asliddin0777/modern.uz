"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/liked.module.css";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import TopHeader from "../components/global/TopHeader";
import Categories from "../components/global/Categories";
import Card from "../components/global/Card";
import Loader from "../components/local/Loader";
import { uuid as uuidv4 } from "uuidv4";
import axios from "axios";
export default function Liked() {
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [categories, setCategories] = useState([]);
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
