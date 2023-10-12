"use client"
import React, { memo, useEffect, useState } from "react";
import styles from "@/styles/topnav.module.css";
import Link from "next/link";
import Image from "next/image";
import Auth from "./Auth";
import { useCookies } from "react-cookie";
import { useRouter } from 'next/navigation'
import axios from "axios";
const TopHeader = () => {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [fromWhere, setFromWhere] = useState<number>(0)
  const closed = !isAuthOpen

  const [cookie] = useCookies(["userInfo"])
  const { userInfo } = cookie
  const { push } = useRouter()

  useEffect(() => {
    document.body.style.overflow = "auto"
  }, [closed])
  const [load, setLoad] = useState(true)
  useEffect(() => {
    setLoad(true)
    if (userInfo) {
      axios.get(`${process.env.NEXT_PUBLIC_API}/api/users/current`, {
        headers: {
          Authorization: userInfo.userToken
        }
      }).then(res => setLoad(false)).finally(() => {
        setLoad(false)
      })
    }
  }, [])

  if (load === false && userInfo) {
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
        <div style={{
          cursor: "pointer"
        }} onClick={() => {
          push("/profile")
        }} className={styles.auth}>
          <Image src={"/icons/user.svg"} width={14} height={18} alt="user icon" />
          <button>Профиль</button>
        </div>
      </div>
    );
  } else {
    if (!userInfo) {
      return <div className={styles.topNavBar}>
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
        <div style={{
          cursor: "pointer"
        }} className={styles.auth}>
          <button onClick={() => {
            push("/auth/login")
          }} >Войти</button>
          <p> | </p>
          <button onClick={() => {
            push("/auth/register")
          }}>Зарегестрироваться</button>
        </div>
      </div>
    }
  }
}

export default memo(TopHeader);
