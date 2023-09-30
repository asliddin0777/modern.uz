"use client"
import React, { memo, useEffect, useState } from "react";
import styles from "@/styles/aboutUs.module.css";
import TopHeader from "../components/global/TopHeader";
import Header from "../components/global/Header";
import Categories from "../components/global/Categories";
import Image from "next/image";
import Footer from "../components/global/Footer";
import axios from "axios";
import Loader from "../components/local/Loader";

const AboutUs = () => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
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
        const [res1, res2] = await axios.all([categories, subCategories]);
        setCategories(res1.data);
        setSubCategories(res2.data);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  if (load === false) {
    return (
      <div className={styles.container}>
        <Categories categories={categories} subcategories={subCategories}/>
        <div className={styles.aboutUs}>
          <div className={styles.aboutUsTitle}>
            <h3>О нас</h3>
          </div>
          <div className={styles.businasswoman}>
            <Image
              src={"/images/bussineswoman.png"}
              width={480}
              height={371}
              alt="hello"
            />
            <div className={styles.titleText}>
              <p>Заголовок текст</p>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
              </span>
            </div>
          </div>
          <div className={styles.businassman}>
            <div className={styles.titleText}>
              <p>Заголовок текст</p>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
              </span>
            </div>
            <Image
              src={"/images/businassman.png"}
              width={480}
              height={371}
              alt="hello"
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <><Loader /></>
  }
};

export default memo(AboutUs);
