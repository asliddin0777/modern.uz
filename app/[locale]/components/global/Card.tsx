"use client";
import React, {
  Dispatch,
  SetStateAction,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import styles from "@/styles/card.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import likes from "@/public/icons/like2.svg";
import likeBlue from "@/public/likeBlue.svg";
import { useCookies } from "react-cookie";
import { uuid as uuidv4 } from "uuidv4";
import axios from "axios";
import Auth from "./Auth";
import IProduct from "@/interfaces/Product/IProduct";
import { IPage } from "@/interfaces/IPage";
import { CartContext } from "../../layout";
import Success from "../local/Success";
import AOS from "aos";
import "aos/dist/aos.css";


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
  card?: IProduct;
  setData: Dispatch<SetStateAction<boolean>>;
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
  setData,
}: Card) => {
  const [like, setLike] = useState(false);
  const {push} = useRouter()
  const [fromWhere, setFromWhere] = useState(1);
  const [cookie] = useCookies(["userInfo"]);
  const [auth, setAuth] = useState<boolean>(false);
  const { userInfo } = cookie;
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [succed, setSucced] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  useEffect(() => {
    if (auth === false) {
      document.body.style.overflow = "auto";
    }
  }, [auth]);
  const {inCart, setInCart}:any = useContext(CartContext)
  

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const sellBot = () => {
    if (userInfo) {
      const send = `title: ${title}%0Acategory: ${cat}%0Aprice: ${price}%0Auser: +${userInfo.userPhoneNumber}`;
      axios({
        method: "post",
        url: `https://api.telegram.org/bot6306734073:AAHd8DekE-bnRW1yv2bJrBUAU8dH6nUziLw/sendMessage?chat_id=5356847426&text=${send}`,
      });
      setMsg("We will contact you as soon as possible");
      setSucced(!succed);
    } else {
      setAuth(!auth);
    }
  };
  return (
    <div key={String(url)} className={styles.card}>
      <Link href={`/product/${title}?id=${url}`} className={styles.imageOfCard}>
        {image !== undefined ? (
          <Image
            src={image}
            alt="products image"
            width={width}
            height={height}
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#c9c9c9"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M3.74157 20.5545C4.94119 22 7.17389 22 11.6393 22H12.3605C16.8259 22 19.0586 22 20.2582 20.5545M3.74157 20.5545C2.54194 19.1091 2.9534 16.9146 3.77633 12.5257C4.36155 9.40452 4.65416 7.84393 5.76506 6.92196M3.74157 20.5545C3.74156 20.5545 3.74157 20.5545 3.74157 20.5545ZM20.2582 20.5545C21.4578 19.1091 21.0464 16.9146 20.2235 12.5257C19.6382 9.40452 19.3456 7.84393 18.2347 6.92196M20.2582 20.5545C20.2582 20.5545 20.2582 20.5545 20.2582 20.5545ZM18.2347 6.92196C17.1238 6 15.5361 6 12.3605 6H11.6393C8.46374 6 6.87596 6 5.76506 6.92196M18.2347 6.92196C18.2347 6.92196 18.2347 6.92196 18.2347 6.92196ZM5.76506 6.92196C5.76506 6.92196 5.76506 6.92196 5.76506 6.92196Z"
                stroke="#adadad"
                strokeWidth="1.5"
              ></path>{" "}
              <path
                opacity="0.5"
                d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6"
                stroke="#adadad"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>{" "}
            </g>
          </svg>
        )}
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
            <h3>{price} сум</h3>
          </div>
        </div>
      </Link>
      {auth && (
        <Auth
          fromWhere={fromWhere}
          isAuthOpen={auth}
          setFromWhere={setFromWhere}
          setIsAuthOpen={setAuth}
        />
      )}
      <Success err={succed} msg={msg} setErr={setSucced}/>
      <div
        className={styles.like}
        onClick={() => {
          if (userInfo) {
            axios
              .put<IProduct>(
                `/products/like/${url}`,
                {},
                {
                  headers: {
                    Authorization: userInfo.userToken,
                  },
                }
              )
              .then((res: any) => {
                setData((prev) => !prev);
              })
              .catch((err) => console.log(err));
          } else {
            setAuth(!auth);
          }
        }}
      >
        {/* <Image
          src={ ? likeBlue : likes}
          alt="like icon"
          width={45}
          height={45}
        /> */}
        {card &&
        userInfo &&
        card.likes?.find((id) => id === userInfo.userId) ? (
          <svg
            className={styles.like}
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ff0000"
            strokeWidth="0.9120000000000001"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                fill="#f00"
              ></path>{" "}
            </g>
          </svg>
        ) : (
          <svg
            className={styles.like}
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ff0000"
            strokeWidth="0.9120000000000001"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                fill="#ffffff00"
              ></path>{" "}
            </g>
          </svg>
        )}
      </div>
      <div className={styles.buy}>
        <button onClick={sellBot}>Купить</button>
        <div onClick={() => {
          if (userInfo) {
            axios.put(`/users/basket/add/${url}`, {}, {
              headers: {
                Authorization: userInfo.userToken
              }
            }).then(res => {
              setAddedToCart(!addedToCart)
              setInCart(res.data.basket)
              setSucced(!succed)
              succed === true && setMsg("Added to cart")
            }).catch(err => console.log(err))
          } else {
            setAuth(!auth);
          }
        }} className={`${styles.box} ${styles.like}`}>
          <Image
            src={"/icons/buyW.svg"}
            alt="add cart icon"
            width={21}
            height={20.5}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
