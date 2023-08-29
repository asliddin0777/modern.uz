"use client"
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import styles from "@/styles/burger.module.css"
import Image from 'next/image'
import Link from 'next/link'

interface Burger {
  setIsBurgerOpen: Function
  isBurgerOpen: boolean
}

const Burger = ({ setIsBurgerOpen, isBurgerOpen }: Burger) => {
  return (
    <div className={isBurgerOpen ? styles.burger : styles.dn}>
      <div className={styles.container}>
        <button onClick={() => {
          setIsBurgerOpen(false)
        }}>
          <Image src={"/icons/menu-close.svg"} width={28} height={28} alt='menu bar close image' />
        </button>
        <h2 style={{
          textTransform: "uppercase",
          color: "#e4b717",
          textAlign: "center"
        }}>Modern</h2>
        <div className={styles.search}>
          <input type="text" placeholder='Поиск' />
          <button>
            <Image src={"/icons/search.svg"} width={22} height={22} alt='search icon' />
          </button>
        </div>
        <div className={styles.navigation}>
          <div className={styles.navigateItem}>
            <Image src={"/icons/home.svg"} alt='home icon' width={22} height={22} />
            <p>Главная</p>
          </div>
          <div className={styles.navigateItem}>
            <Image src={"/icons/basket.svg"} alt='bascet icon' width={22} height={22} />
            <p>Корзина</p>
          </div>
          <div className={styles.navigateItem}>
            <Image src={"/icons/userimage.svg"} alt='home icon' width={22} height={22} />
            <p>Профиль</p>
          </div>
          <div className={styles.navigateItem}>
            <Image src={"/icons/basket.svg"} alt='home icon' width={22} height={22} />
            <p>Заводы</p>
          </div>
          <div className={styles.navigateItem}>
            <Image src={"/icons/heart.svg"} alt='home icon' width={22} height={22} />
            <p>Избранные</p>
          </div>
          <div className={styles.navigateItem}>
            <Image src={"/icons/order.svg"} alt='home icon' width={22} height={22} />
            <p>Заказы</p>
          </div>
        </div>
        <Link href="#" className={styles.contact}>
          <Image src={"/icons/call.svg"} width={22} height={22} alt='call icon' />
          +998 99 999 99 99
        </Link>
      </div>
      <div className={styles.right} onClick={() => {
        setIsBurgerOpen(false)
      }} />
    </div>
  )
}

export default Burger