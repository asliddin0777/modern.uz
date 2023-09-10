'use client'
import React, { useState } from "react";
import styles from "@/styles/aboutUs.module.css";
import TopHeader from "../components/global/TopHeader";
import Header from "../components/global/Header";
import Categories from "../components/global/Categories";
import Image from "next/image";
import Footer from "../components/global/Footer";


const AboutUs = () => {
  return (
    <div className={styles.container}>
      <TopHeader />
      <Header />
      <Categories categories={[]} subcategories={[]}/>
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

      <div style={{ marginTop: "11rem" }}>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
