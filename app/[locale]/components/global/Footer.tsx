"use client";
import React from "react";
import Link from "next/link";
import styles from "@/styles/footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link
          href={"/"}
          className={styles.logo}
          style={{
            color: "#E4B717",
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: 16,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            position: "relative",
          }}
        >
          <Image src={"/images/logo.png"} alt="logo" width={97} height={57} />{" "}
          <span
            style={{
              position: "relative",
              left: -16,
            }}
          >
            Modern shop
          </span>
        </Link>
        <div className={styles.center}>
          <ul className={styles.navigation}>
            <li>
              <Link href={"/"}>Bosh sahifa</Link>
            </li>
            <li>
              <Link href={"/delivery"}>Yetkazib berish</Link>
            </li>
          </ul>
          <ul className={styles.navigation}>
            <li>
              <Link href={"/aboutUs"}>Biz haqimizda</Link>
            </li>
            <li>
              <Link href={"/contact"}>Biz bilan bog'lanish</Link>
            </li>
          </ul>
          <ul className={styles.navigation}>
          </ul>
        </div>
        <div className={styles.last}>
          <h3>Ijtimoiy tarmoqlar:</h3>
          <div className={styles.links}>
            {/* <Link href={"#"}>
              <Image src={"/icons/faceB.svg"} width={25} height={25} alt="ss" />
            </Link>
            <Link href={"#"}>
              {" "}
              <Image src={"/icons/gmail.svg"} width={25} height={25} alt="ss" />
            </Link> */}
            <Link target="_blank" href={"https://www.instagram.com/modern_shop.uz/"}>
              <Image
                src={"/icons/instagram.svg"}
                width={25}
                height={25}
                alt="ss"
              />
            </Link>
            {/* <Link href={"#"}>
              <Image
                src={"/icons/telegram.svg"}
                width={25}
                height={25}
                alt="ss"
              />
            </Link>
            <Link href={"#"}>
            <Image src={"/icons/youtube.svg"} width={25} height={25} alt="ss" />
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
