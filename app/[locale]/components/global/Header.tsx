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
            <Link href={"tel: + 998 99 999 99 99"} className={styles.call}>
              + 998 99 999 99 99
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
                <Image
                  src={"/icons/buy.svg"}
                  alt="language icon"
                  width={20}
                  height={20}
                />
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
