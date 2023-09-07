"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/card.module.css";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import likes from "@/public/icons/like2.svg";
import likeBlue from "@/public/likeBlue.svg";
import { useCookies } from 'react-cookie';
import { uuid as uuidv4 } from 'uuidv4';
import axios from "axios";
import Auth from "./Auth";
import IProduct from "@/interfaces/Product/IProduct";
import { IPage } from "@/interfaces/IPage";


interface Card {
  price: string;
  title: string;
  width: number;
  image: string | undefined;
  height: number;
  cat: string;
  animation: string;
  url: string | number;
  likedObj?: any[] | undefined;
  setLikedObj: Function | undefined;
  isLiked: boolean | undefined;
  card?: IProduct
  setData: Dispatch<SetStateAction<boolean>>
}


const Card = ({
  price,
  title,
  width,
  height,
  image,
  cat,
  url,
  card,
  setData
}: Card) => {
  const [like, setLike] = useState(false);
  const [fromWhere, setFromWhere] = useState(1)
  const [cookie] = useCookies(["userInfo"])
  const [auth, setAuth] = useState<boolean>(false)
  const { userInfo } = cookie
  useEffect(() => {
    if (auth === false) {
      document.body.style.overflow = "auto"
    }
  }, [auth])
  // useEffect(() => {
  //   if(router.pathname === "/category") {
  //     setAnimation(false)
  //   }
  // }, [])
  // console.log("dcscsd", router)

  // duration={0.3} animateOut={animate === true ? "animate__zoomOut" : ""} animateOnce={animate} animateIn={animate === true ? "animate__zoomIn" : ""}
  return (
    <div key={uuidv4()} className={styles.card}>
      <Link className={styles.imageOfCard} href={`/product/${url}`}>
        {image !== undefined ? <Image src={image} alt="products image" width={width} height={height} /> : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#c9c9c9"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.74157 20.5545C4.94119 22 7.17389 22 11.6393 22H12.3605C16.8259 22 19.0586 22 20.2582 20.5545M3.74157 20.5545C2.54194 19.1091 2.9534 16.9146 3.77633 12.5257C4.36155 9.40452 4.65416 7.84393 5.76506 6.92196M3.74157 20.5545C3.74156 20.5545 3.74157 20.5545 3.74157 20.5545ZM20.2582 20.5545C21.4578 19.1091 21.0464 16.9146 20.2235 12.5257C19.6382 9.40452 19.3456 7.84393 18.2347 6.92196M20.2582 20.5545C20.2582 20.5545 20.2582 20.5545 20.2582 20.5545ZM18.2347 6.92196C17.1238 6 15.5361 6 12.3605 6H11.6393C8.46374 6 6.87596 6 5.76506 6.92196M18.2347 6.92196C18.2347 6.92196 18.2347 6.92196 18.2347 6.92196ZM5.76506 6.92196C5.76506 6.92196 5.76506 6.92196 5.76506 6.92196Z" stroke="#adadad" stroke-width="1.5"></path> <path opacity="0.5" d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6" stroke="#adadad" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>}
        <div className={styles.somevalues}>
          <h3
            style={{
              color: "#000",
            }}
          >
            {title}
          </h3>
          <h4>{cat}</h4>
          <div className={styles.cart}>
            <h3>{price}</h3>

          </div>
        </div>
      </Link>
      {auth && <Auth fromWhere={fromWhere} isAuthOpen={auth} setFromWhere={setFromWhere} setIsAuthOpen={setAuth} />}
      <div
        className={styles.like}
        onClick={() => {
          if (userInfo) {
            axios.put<IProduct>(`/products/like/${url}`, {}, {
              headers: {
                Authorization: userInfo.userToken
              }
            }).then(res => {
              setData(true)
              console.log(res);
            }).catch(err => console.log(err))
          } else {
            setAuth(!auth)
          }
        }}
      >
        <Image
          src={card && userInfo && card.likes.find(id => id === userInfo.userId) ? likeBlue : likes}
          alt="like icon"
          width={45}
          height={45}
        />
      </div>
      <div className={`${styles.box} ${styles.like}`}>
        <Image
          src={"/icons/buyW.svg"}
          alt="add cart icon"
          width={21}
          height={20.5}
        />
      </div>
    </div>
  );
};

export default Card;
