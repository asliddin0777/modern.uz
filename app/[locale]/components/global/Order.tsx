"use client"
import styles from "@/styles/order.module.css";
import Image from "next/image";
import Link from "next/link";
import check from '@/public/icons/check.svg'
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import useCookies from "react-cookie/cjs/useCookies";

interface Order {
  setOrder: Function;
  order: boolean;
  selectedProduct: any
}

const Order = ({ setOrder, order, selectedProduct }: Order) => {
  const [cookie, setCookie] = useCookies(["aboutUser"])
  const [userInform] = useCookies(["userInfo"])
  const router = useRouter()
  const path = usePathname()
  const { aboutUser } = cookie
  const { userInfo } = userInform

  const [selectedCard, setSelectedCard] = useCookies(["selectedCard"]);

  const [array, setArray] = useState(selectedCard.selectedCard || []);

  const handlePushToCart = () => {
    const updatedArray = [...array, {
      product: selectedProduct,
      productId: path,
      qty: 1
    }];
    setArray(updatedArray);
    setSelectedCard("selectedCard", updatedArray);
  }

  const handlePost = () => {
    axios.post(`${process.env.NEXT_PUBLIC_API}/api/orders/new`, {
      products: selectedProduct,
      deliveryAddress: "some address to deliver"
    },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": userInfo ? userInfo.userToken : aboutUser ? aboutUser.userToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjkyMDU5YTI3Njc1OTk0N2QyOTZkMyIsInBob25lTnVtYmVyIjo5OTg5MTIzNDU2NzgsImlhdCI6MTY4OTk1Mzc0N30.nz6rhxCKJj2q5ZIyn2ydBgOy90Lw2Y5RsgfjPbjT0a8"
        },
      }).then((res: any) => {
        setCookie("aboutUser", {
          userBooked: res.data.id,
          userId: res.data.id,
          userToken: userInfo ? userInfo.userToken  : aboutUser ? res.data.token : ""
        }, { path: "/" })
      }).catch(err => console.log(err))
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
            path === "/cart" ? handlePost() : handlePushToCart() 
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
      </div>
    </>
  );
};

export default Order;
