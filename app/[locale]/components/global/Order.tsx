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

interface Order {
  products: {
    id: string
    sum: number,
    qty: number
  }[],
  order: boolean,
  setOrder: Function,
  deliveryTo: string
}

const Order = ({ setOrder, order, products, deliveryTo }: Order) => {
  const [cookie, setCookie] = useCookies(["aboutUser"])
  const [userInform] = useCookies(["userInfo"])
  const router = useRouter()
  const path = usePathname()
  const { push } = useRouter()
  const { aboutUser } = cookie
  const { userInfo } = userInform
  const [auth, setAuth] = useState(false)
  const [succed, setSucced] = useState(false)
  const [fromWhere, setFromWhere] = useState(1)
  const handlePost = () => {
    if (userInfo) {
      axios.post(`${process.env.NEXT_PUBLIC_API}/api/orders/new`, {
        products: products.map(pr => {
          return {
            price: pr.sum.toString().length < 3,
            productId: pr.id,
            qty: pr.qty
          }
        }),
        deliveryAddress: deliveryTo
      },
        {
          headers: {
            Authorization: userInfo.userToken
          },
        }).then((res: any) => {
          if(res.data) {
            // products.map(pr => {
            //   axios.put(
            //     `${process.env.NEXT_PUBLIC_API}/api/users/basket/remove/${pr.id}`,
            //     {},
            //     {
            //       headers: {
            //         Authorization: userInfo
            //           ? userInfo.userToken
            //           : "",
            //       },
            //     }
            //   ).then((res) => {
            //     push("/profile")
            //   })
            // }
            // )
          }
          setCookie("aboutUser", {
            userBooked: products,
            userToken: userInfo ? userInfo.userToken : aboutUser ? res.data.token : ""
          }, { path: "/" })
        })
        
    } else {
      push("/auth/login")
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
            <h3>Ariza qabul qilindi</h3>
            <p>Tez orada siz bilan bog'lanamiz</p>
          </div>
          <button onClick={() => {
            handlePost()
            setOrder(false);
          }} className={styles.take}>
            Qabul qilish
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
