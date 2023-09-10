"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "@/styles/head.module.css";
import Image from "next/image";
import Link from "next/link";
import Burger from "./Burger";
import { uuid as uuidv4 } from "uuidv4";

const Header = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState<boolean | any>(false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("RU");

  const languges: string[] = ["RU", "UZ"];

  useEffect(() => {
    isBurgerOpen
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "auto");
  }, [isBurgerOpen]);

  return (
    <header className={styles.header}>
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
        <div className={styles.search}>
          <input type="text" placeholder="Поиск" />
          <Image
            src="/icons/search.svg"
            alt="search icon"
            width={22}
            height={22}
          />
        </div>
        <Burger isBurgerOpen={isBurgerOpen} setIsBurgerOpen={setIsBurgerOpen} />
        <div className={styles.contra}>
          <div
            onMouseOver={() => {
              setMouseOver(true);
            }}
            onMouseLeave={() => {
              setMouseOver(false);
            }}
            className={styles.contraLeft}
          >
            <div className={styles.image}>
              <Image
                src={"/icons/inet.svg"}
                alt="language icon"
                width={20}
                height={20}
              />
            </div>
            <div className={styles.select}>
              <h4>{language}</h4>
              <Image
                className={mouseOver ? styles.animated : styles.just}
                src={"/icons/chevronDown.svg"}
                width={12}
                height={7}
                alt="chevron down"
              />
            </div>
            <div
              className={mouseOver ? styles.selectLanguage : styles.just}
              style={
                !mouseOver
                  ? {
                    display: "none",
                  }
                  : {}
              }
            >
              {languges.map((e: string) => {
                return (
                  <h4
                    key={uuidv4()}
                    onClick={() => {
                      setLanguage(e);
                      setMouseOver(false);
                    }}
                  >
                    {e}
                  </h4>
                );
              })}
            </div>
          </div>
          <div className={styles.contraRight}>
            <div className={styles.image}>
              <Image
                src={"/icons/call.svg"}
                alt="language icon"
                width={20}
                height={20}
              />
            </div>
            <Link href={"tel: + 998 93 059 59 37"} className={styles.call}>
              + 998 93 059 59 37
            </Link>
          </div>
          <div className={styles.ads}>
            <div className={styles.image}>
              <Link href="/liked">
                <Image
                  src={"/icons/like.svg"}
                  alt="language icon"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
            <div className={styles.image}>
              <Link href="/cart" locale="ru">
                <svg width="20" height="20" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.918457 1L3.11934 1.37995L4.13831 13.4889C4.21978 14.4778 5.04829 15.2367 6.04292 15.2335H17.5859C18.5351 15.2356 19.3403 14.539 19.4747 13.6018L20.4788 6.68031C20.591 5.90668 20.0524 5.18899 19.2779 5.07712C19.2101 5.06762 3.47275 5.06234 3.47275 5.06234" stroke="#363636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12.9546 8.96326H15.8887" stroke="#363636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.57855 18.8921C5.89704 18.8921 6.15416 19.1496 6.15416 19.4662C6.15416 19.7839 5.89704 20.0415 5.57855 20.0415C5.26005 20.0415 5.00293 19.7839 5.00293 19.4662C5.00293 19.1496 5.26005 18.8921 5.57855 18.8921Z" fill="#363636" stroke="#363636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5146 18.8921C17.8331 18.8921 18.0913 19.1496 18.0913 19.4662C18.0913 19.7839 17.8331 20.0415 17.5146 20.0415C17.1961 20.0415 16.939 19.7839 16.939 19.4662C16.939 19.1496 17.1961 18.8921 17.5146 18.8921Z" fill="#363636" stroke="#363636" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </Link>
            </div>
            <button
              className={styles.image}
              onClick={() => {
                setIsBurgerOpen(true);
              }}
            >
              <Image
                src={"/icons/burger.svg"}
                alt="language icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
