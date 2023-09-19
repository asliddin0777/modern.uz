"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "@/styles/burger.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Auth from "./Auth";

interface Burger {
  setIsBurgerOpen: Function;
  isBurgerOpen: boolean;
}

const Burger = ({ setIsBurgerOpen, isBurgerOpen }: Burger) => {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [fromWhere, setFromWhere] = useState<number>(0);

  const closed = !isAuthOpen;

  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, [closed]);

  return (
    <div className={isBurgerOpen ? styles.burger : styles.dn}>
      <div className={styles.container}>
        <button
          onClick={() => {
            setIsBurgerOpen(false);
          }}
        >
          <Image
            src={"/icons/menu-close.svg"}
            width={28}
            height={28}
            alt="menu bar close image"
          />
        </button>
        <h2
          style={{
            textTransform: "uppercase",
            color: "#e4b717",
            textAlign: "center",
          }}
        >
          Modern
        </h2>
        <div className={styles.search}>
          <input type="text" placeholder="Поиск" />
          <button>
            <Image
              src={"/icons/search.svg"}
              width={22}
              height={22}
              alt="search icon"
            />
          </button>
        </div>
        <div className={styles.navigation}>
          <div className={styles.navigateItem}>
            <Image
              src={"/icons/home.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <Link href="/">Главная</Link>
          </div>
          <div className={styles.navigateItem}>
            <Image
              src={"/icons/basket.svg"}
              alt="bascet icon"
              width={22}
              height={22}
            />
            <Link href="/cart" locale="ru">
              Корзина
            </Link>
          </div>
          <div className={styles.navigateItem}>
            <Image
              src={"/icons/userimage.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            {userInfo === undefined ? (
              <div className={styles.auth}>
                <button
                  style={{ color: "#000", fontSize: 16 }}
                  onClick={() => {
                    setIsAuthOpen(true);
                    setFromWhere(1);
                  }}
                >
                  Войти
                </button>
                {/* <p> | </p>
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setFromWhere(2);
                  }}
                >
                  Зарегестрироваться
                </button> */}
              </div>
            ) : (
              <div
                className={styles.auth}
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <button style={{ color: "#000", fontSize: 16 }}>Профиль</button>
              </div>
            )}
          </div>
          {/* <div className={styles.navigateItem}>
            <Image
              src={"/icons/basket.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <p>Заводы</p>
          </div> */}
          <div className={styles.navigateItem}>
            <Image
              src={"/icons/heart.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <Link href="/liked">Избранные</Link>
          </div>
          <li>
            <Link href="/delivery">Доставка</Link>
          </li>
          <li>
            <Link href="/aboutUs">О нас</Link>
          </li>
          <li>
            <Link href="/contact">Контакты</Link>
          </li>
        </div>
        <Link href="#" className={styles.contact}>
          <Image
            src={"/icons/call.svg"}
            width={22}
            height={22}
            alt="call icon"
          />
          +998 99 999 99 99
        </Link>
      </div>
      <div
        className={styles.right}
        onClick={() => {
          setIsBurgerOpen(false);
        }}
      />
      {isAuthOpen && (
        <Auth
          fromWhere={fromWhere}
          setFromWhere={setFromWhere}
          isAuthOpen={isAuthOpen}
          setIsAuthOpen={setIsAuthOpen}
        />
      )}
    </div>
  );
};

export default Burger;
