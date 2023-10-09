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
  const { push } = useRouter();
  const [fromWhere, setFromWhere] = useState(1);
  const [cookie] = useCookies(["userInfo"]);
  const [auth, setAuth] = useState<boolean>(false);
  const { userInfo } = cookie;
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [succed, setSucced] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [error, setErr] = useState<boolean>(false)
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

  const category = path.split("/")[1]

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
      <div key={String(url)} data-aos="fade-up" className={styles.card}>
        <Link
          href={`/product/${title}?id=${url}`}
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
              const data = {
                method: "put",
                url: sendLike,
                headers: {
                  Authorization: userInfo.userToken,
                },
              };
              axios(data)
                .then((res) => {
                  setData((prev) => !prev);
                })
                .catch((err) => console.log(err));
            } else {
              setAuth(!auth);
            }
          }}
        >
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
        {path.split("/")[1] !== "company" && <div className={styles.buy}>
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
        </div>}
      </div>
    </>
  );
};

export default memo(Card);
