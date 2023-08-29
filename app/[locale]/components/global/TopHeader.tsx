"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/topnav.module.css";
import Link from "next/link";
import Image from "next/image";
import Auth from "./Auth";
import { useCookies } from "react-cookie";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const TopHeader = () => {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [fromWhere, setFromWhere] = useState<number>(0)

  const closed = !isAuthOpen

  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = "auto"
  }, [closed])

  return (
    <div className={styles.topNavBar}>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link href="/">Главная</Link>
          </li>
          <li>
            <Link href="/delivery">Доставка</Link>
          </li>
          <li>
            <Link href="/aboutUs">О нас</Link>
          </li>
          <li>
            <Link href="/contact">Контакты</Link>
          </li>
        </ul>
      </nav>
      {userInfo === undefined ? <div className={styles.auth}>
        <Image src={"/icons/user.svg"} width={14} height={18} alt="user icon" />
        <button onClick={() => {
          setIsAuthOpen(true)
          setFromWhere(1)
        }} >Войти</button>
        <p> | </p>
        <button onClick={() => {
          setIsAuthOpen(true)
          setFromWhere(2)
        }}>Зарегестрироваться</button>
      </div> : <div className={styles.auth} onClick={() => {
        router.push("/profile")
      }}>
        <Image src={"/icons/user.svg"} width={14} height={18} alt="user icon" />
        <button>Профиль</button></div>}
      {isAuthOpen && <Auth fromWhere={fromWhere} setFromWhere={setFromWhere} isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen} />}
    </div>
  );
};

export default TopHeader;
