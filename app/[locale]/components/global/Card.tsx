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
import { usePathname, useRouter } from "next/navigation";
import likes from "@/public/icons/like2.svg";
import likeBlue from "@/public/likeBlue.svg";
import { useCookies } from "react-cookie";
import { uuid as uuidv4 } from "uuidv4";
import axios from "axios";
import Auth from "./Auth";
import IProduct from "@/interfaces/Product/IProduct";
import { IPage } from "@/interfaces/IPage";
import Success from "../local/Success";
import AOS, { refresh } from "aos";
import "aos/dist/aos.css";
import Error from "../local/Error";
import socket from "../local/socket";

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
  const { push } = useRouter();
  const [fromWhere, setFromWhere] = useState(1);
  const [cookie] = useCookies(["userInfo"]);
  const [auth, setAuth] = useState<boolean>(false);
  const { userInfo } = cookie;
  const [like, setLike] = useState(card?.likes?.find((id) => id === userInfo?.userId) ? true : false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [succed, setSucced] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [error, setErr] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  useEffect(() => {
    if (auth === false) {
      document.body.style.overflow = "auto";
    }
  }, [auth]);

  const sendLike = `${process.env.NEXT_PUBLIC_API}/api/products/like/${card?.id}`;

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
  const path = usePathname()

  const pathS = path.split("/")[1]
  return (
    <>
      {auth && (
        <Auth
          fromWhere={fromWhere}
          isAuthOpen={auth}
          setFromWhere={setFromWhere}
          setIsAuthOpen={setAuth}
          fromCat={true}
        />
      )}
      <Success err={succed} msg={msg} setErr={setSucced} />
      <Error err={error} msg={msg} setErr={setErr} />
      <div style={pathS === "company" ? {
        height: 250
      } : {}} key={String(url)} data-aos="fade-up" className={styles.card}>
        <Link
          href={`/product/${title.split(" ").join("-")}?id=${url}`}
          className={styles.imageOfCard}
        >
          {image !== undefined ? (
            <Image
              src={image}
              alt="products image"
              width={width}
              height={height}
            />
          ) : (
            <h1>No Image</h1>
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
        <div
          className={styles.like}
          onClick={() => {
            if (userInfo && card) {
              setLike(!like)
              const data = {
                method: "put",
                url: sendLike,
                headers: {
                  Authorization: userInfo.userToken,
                },
              };
              axios(data)
                .catch((err) => console.log(err));
            } else {
              setAuth(!auth);
            }
          }}
        >
          {card &&
            userInfo && like === true ? (
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
        {path.split("/")[1] !== "company" ? <div className={styles.buy}>
          <button onClick={sellBot}>Купить</button>
          <div
            onClick={() => {
              if (userInfo) {
                axios
                  .put(
                    `${process.env.NEXT_PUBLIC_API}/api/users/basket/add/${url}`,
                    {},
                    {
                      headers: {
                        Authorization: userInfo.userToken,
                      },
                    }
                  )
                  .then((res) => {
                    setAddedToCart(!addedToCart);
                    setSucced(!succed);
                    setMsg("Added to cart");
                  })
                  .catch((err) => {
                    setErr(!error)
                    setMsg(err.response.data.errors[0].message)
                  });
              } else {
                setAuth(!auth);
              }
            }}
            className={`${styles.box} ${styles.like}`}
          >
            <Image
              src={"/icons/buyW.svg"}
              alt="add cart icon"
              width={21}
              height={20.5}
            />
          </div>
        </div> : <div style={{
          left: "95%"
        }} className={styles.buy}>
          <div
            className={styles.chatButton}
            onClick={() => {
              socket.connect();
              if (userInfo !== undefined && card) {
                setIsChatOpen(!isChatOpen);
                socket.emit(
                  "newUser",
                  JSON.stringify({
                    id: userInfo.userId,
                    fullName: `${localStorage.getItem(
                      "userName"
                    )} ${localStorage.getItem("lastName")}`,
                  })
                );
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_API}/api/chats/new`,
                    {
                      admin: typeof card?.author === "string"?card?.author :card?.author.id,
                      product: card.id
                    },
                    {
                      headers: {
                        Authorization: userInfo.userToken,
                      },
                    }
                  )
                  .then((res) => {
                    push(`/chats?id=${res.data.id}`)
                  });
              } else {
                setAuth(!auth);
                setFromWhere(1);
              }
            }}
          >
            <svg viewBox="0 0 24.00 24.00" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5" stroke="#ffffff" strokeWidth="0.792" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
          </div>
        </div>}
      </div>
    </>
  );
};

export default memo(Card);
