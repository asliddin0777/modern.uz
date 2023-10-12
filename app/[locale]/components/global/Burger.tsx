"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "@/styles/burger.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Auth from "./Auth";
import IProduct from "@/interfaces/Product/IProduct";
import SearchModal from "./SearchModal";

interface Burger {
  setIsBurgerOpen: Function;
  isBurgerOpen: boolean;
  products: IProduct[]
}

const Burger = ({ setIsBurgerOpen, isBurgerOpen, products }: Burger) => {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(0);
  const {push} = useRouter()
  const closed = !isAuthOpen;

  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, [closed]);

  const [searchTerm, setSearchTerm] = useState('');
  const [foundVal, setFoundVal] = useState<IProduct[]>()
  const handleSearch = (event: {
    target: {
      value: string
    }
  }) => {
    setSearchTerm(event.target.value);
    console.log(searchTerm);
  };
  const handleSubmit = (e: {
    preventDefault: Function
  }) => {
    e.preventDefault()
    if (searchTerm.length !== 0) {
      const searchResults = products.filter((item) =>
        item.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
      );
      setFoundVal(searchResults)
    } else {
      setFoundVal([])
    }
  }

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
        <form className={styles.search}>
          <input value={searchTerm} onChange={handleSearch} autoComplete="off" type="text" placeholder="Поиск" />
          <button onClick={handleSubmit}>
            <Image
              style={{
                cursor: "pointer"
              }}
              src="/icons/search.svg"
              alt="search icon"
              width={22}
              height={22}
            />
          </button>
        </form>
        <SearchModal products={foundVal ? foundVal : []} entity={"burger"} />
        <div className={styles.navigation}>
          <div onClick={()=> {
            push("/")
          }} className={styles.navigateItem}>
            <Image
              src={"/icons/home.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <Link href="/">Главная</Link>
          </div>
          <div onClick={()=> {
            push("/cart")
          }} className={styles.navigateItem}>
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
          <div onClick={()=> {
            userInfo && push("/profile")
          }} className={styles.navigateItem}>
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
              </div>
            ) : (
              <div
                className={styles.auth}
                onClick={() => {
                  push("/profile");
                }}
              >
                <button style={{ color: "#000", fontSize: 16 }}>Профиль</button>
              </div>
            )}
          </div>
          <div onClick={()=> {
            push("/liked")
          }} className={styles.navigateItem}>
            <Image
              src={"/icons/heart.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <Link href="/liked">Избранные</Link>
          </div>
          <div onClick={()=> {
            push("/delivery")
          }} className={styles.navigateItem}>
            <Image
              src={"/icons/delivery.svg"}
              alt="home icon"
              width={25}
              height={25}
            />
            <Link href="/delivery">Доставка</Link>
          </div>
          <div onClick={()=> {
            push("/aboutUs")
          }} className={styles.navigateItem}>
            <Image
              src={"/icons/about.svg"}
              alt="home icon"
              width={25}
              height={25}
            />
            <Link href="/aboutUs">О нас</Link>
          </div>
          <div onClick={()=> {
            push("/contact")
          }} className={styles.navigateItem}>
            <Image
              src={"/icons/contactBurger.svg"}
              alt="home icon"
              width={22}
              height={22}
            />
            <Link href="/contact">Контакты</Link>
          </div>
          <div
            onClick={() => {
              if (userInfo) {
                setAuth(false);
              } else {
                setAuth(true);
              }
            }}
          >
            {auth === false && userInfo ? (
              <Link className={styles.navigateItem} href="/chats" locale="ru">
                <svg
                  viewBox="0 0 24.00 24.00"
                  width={24}
                  height={24}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                      stroke="#000000"
                      strokeWidth="0.792"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
                <p>Чаты</p>
              </Link>
            ) : (
              <>
                <Auth
                  fromWhere={fromWhere}
                  setFromWhere={setFromWhere}
                  isAuthOpen={auth}
                  setIsAuthOpen={setAuth}
                />{" "}
                <div style={{ cursor: "pointer" }} className={styles.navigateItem}>
                  <svg
                    viewBox="0 0 24.00 24.00"
                    width={24}
                    height={24}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                        stroke="#000000"
                        strokeWidth="0.792"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                  <p>Чаты</p>
                </div>
              </>
            )}
          </div>
        </div>
        <Link href="tel: + 998 93 059 59 37" className={styles.contact}>
          <Image
            src={"/icons/call.svg"}
            width={22}
            height={22}
            alt="call icon"
          />
          + 998 93 059 59 37
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
