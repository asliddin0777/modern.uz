"use client"
import styles from "@/styles/order.module.css";
import Image from "next/image";
import Link from "next/link";
import check from '@/public/icons/check.svg'
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import useCookies from "react-cookie/cjs/useCookies";
import IProduct from "@/interfaces/Product/IProduct";
import Auth from "./Auth";

interface Order {
  setOrder: Function;
  order: boolean;
  selectedProduct: any;
  totalPrice: number
  counts: number
}

const Order = ({ setOrder, order, selectedProduct, totalPrice, counts }: Order) => {
  const [cookie, setCookie] = useCookies(["aboutUser"])
  const [userInform] = useCookies(["userInfo"])
  const router = useRouter()
  const path = usePathname()
  console.log(selectedProduct)
  const { aboutUser } = cookie
  const { userInfo } = userInform
  const [auth, setAuth] = useState(false)
  console.log(selectedProduct);
  const [fromWhere, setFromWhere] = useState(1)

  const [selectedCard, setSelectedCard] = useCookies(["selectedCard"]);
  const handlePost = () => {
      if (userInfo) {
        axios.post(`${process.env.NEXT_PUBLIC_API}/api/orders/new`, {
          products: {
            productId: selectedProduct,
            qty: counts
          },
          deliveryAddress: "some address to deliver"
        },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": userInfo && userInfo.userToken
            },
          }).then((res: any) => {
            setCookie("aboutUser", {
              userBooked: res.data.id,
              userId: res.data.id,  
              userToken: userInfo ? userInfo.userToken  : aboutUser ? res.data.token : ""
            }, { path: "/" })
          }).catch(err => console.log(err))
      } else {
        setAuth(true)
      }
  }

  return (
    <>
      <div className={order ? styles.order : styles.dn}>
        <div className={styles.orderSide}>
          <div className={styles.close}>
            <button
              onClick={() => {
                setOrder(false);
              }}
            >
              <Image src={"/icons/close.svg"} alt="close icon" width={21} height={21} />
            </button>
          </div>
          <div className={styles.center}>
            <div className={styles.check}>
              <Image
                src={check}
                alt="checked item icon"
                width={164}
                height={164}
              />
            </div>
            <h3>Заявка принята</h3>
            <p>В ближайшее время мы с вами свяжемся</p>
          </div>
          <button onClick={() => {
            handlePost()
            setOrder(false);
          }} className={styles.take}>
            Принять
          </button>
        </div>
        <div
          className={styles.bg}
          onClick={() => {
            setOrder(false);
          }}
        />
        <Auth fromWhere={fromWhere} isAuthOpen={auth} setFromWhere={setFromWhere} setIsAuthOpen={setAuth} />
      </div>
    </>
  );
};

export default Order;
