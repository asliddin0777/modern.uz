"use client";
import React, { memo } from "react";
import styles from "@/styles/cart.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Categories from "../components/global/Categories";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loader from "../components/local/Loader";
import Error from "../components/local/Error";
import { useRouter } from "next/navigation";
import CouterV2 from "@/utils/CouterV2";
import IProduct from "@/interfaces/Product/IProduct";

const Cart = () => {

  const [order, setOrder] = useState<boolean>(false);
  const [load, setLoad] = useState(true);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [userInform] = useCookies(["userInfo"]);
  const { userInfo } = userInform;
  const [totalPrice, setTotalPrice] = useState(0);
  const { refresh, push } = useRouter()
  const [user, setUser] = useState();
  const [totals, setTotals] = useState<{
    id: string,
    sum: number
  }[]>([])
  const [total, setTotal] = useState(0)
  useEffect(() => {
    order
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [order]);

  const [err, setErr] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [cart, setCart] = useState<IProduct[]>([]);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {

    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const subCategories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const user = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/products/liked`,
          {
            headers: {
              Authorization: userInfo === undefined ? "" : userInfo.userToken,
            },
          }
        );
        const cart = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/users/current`,
          {
            headers: {
              Authorization: userInfo === undefined ? "" : userInfo.userToken,
            },
          }
        );
        const [res1, res2, us, ctr] = await axios.all([
          categories,
          subCategories,
          user,
          cart,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setUser(us.data);
        setCart(ctr.data.basket);
      }finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  const sumPrices = (): number => {
    return totals.reduce((sum, tot) => sum + tot.sum, 0)
  }
  const [price, setPrice] = useState<number>(() => sumPrices())

  useEffect(() => {
    if (refetch === true) {
      setLoad(true);
      const fetchData = async () => {
        try {
          const cart = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/users/current`,
            {
              headers: {
                Authorization: userInfo === undefined ? "" : userInfo.userToken,
              },
            }
          );
          const [ctr] = await axios.all([
            cart,
          ]);

          setCart(ctr.data.basket);
        } finally {
          setLoad(false);
        }
      };
      fetchData();
    }
  }, [refetch]);
  useEffect(() => {
    if (cart && cart.length > 0) {
      setLoad(true)
      cart.forEach((obj) => {
        setTotalPrice((prevTotal) => prevTotal + obj.price[0].price);
        if (totals && totals.length) {

        } else {
          setTotals((prev: any) => [...prev, {
            id: obj.id, sum: obj.price[0].price
          }])
        }
      });
      setPrice(sumPrices())
      setLoad(false)
    }
  }, [cart]);
  useEffect(() => {
    let sum = 0
    for (let i = 0; i < totals.length; i++) {
      sum += totals[i].sum;
      
    }
    setTotal(sum)
  }, [totals])
  if (!load) {
    return (
      <div className={styles.delivery}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.cart}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Корзина</h1>
        </div>
        <Error err={error} msg={err} setErr={setError} />
        {cart && cart.length && totalPrice !== undefined ? (
          <section className={styles.DeliverySection}>
            <section className={styles.sectionLeft}>
              {cart && cart.length &&
                cart.map((card: any, index: number) => {
                  return (
                    <div key={card.id} className={styles.card}>
                      {card.media?.length > 0 ? <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${card.media[0].name}`}
                        width={90}
                        height={100}
                        alt="img"
                      /> : <p onClick={() => {
                        push(`/product/${card.name}?id=${card.id}`)
                      }}>НЕТ ИЗОБРАЖЕНИЯ</p>}
                      <div onClick={() => {
                        push(`/product/${card.name}?id=${card.id}`)
                      }} className={styles.menu}>
                        <h1>
                          {card
                            ? card.name
                            : `Phone named something ${card.productId}`}
                        </h1>
                        <p style={{ color: "#B7AFAF" }}>
                          {card.subcategory ? card.subcategory.name : "Artel"}
                        </p>
                      </div>
                      <div className={styles.count}>
                        <p
                          style={{
                            fontSize: 18,
                            fontWeight: 400,
                            color: "#363636",
                          }}
                        >
                          Кол-во:
                        </p>
                        <div className={styles.countButton}>
                          <CouterV2 setAllPrice={setPrice} totals={totals} id={card.id} setTotals={setTotals} prices={card.price} />
                        </div>
                      </div>
                      <div className={styles.countPrice}>
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            axios
                              .put(
                                `${process.env.NEXT_PUBLIC_API}/api/users/basket/remove/${card.id}`,
                                {},
                                {
                                  headers: {
                                    Authorization: userInfo
                                      ? userInfo.userToken
                                      : "",
                                  },
                                }
                              )
                              .then((res) => {
                                setRefetch(!refetch);
                                refresh()
                              });
                          }}
                          className={styles.remove}
                        >
                          <Image
                            src={"/icons/remove.svg"}
                            width={14}
                            height={16}
                            alt="remove"
                          />
                          <p>Удалить</p>
                        </div>
                        <h1>{card ? `${card.price[0].price}` : "900"}</h1>
                      </div>
                    </div>
                  );
                })}
            </section>
            <section className={styles.right}>
              <div className={styles.allPrice}>
                <h1>Ваш заказ</h1>
                <div style={{ display: "flex", gap: 15, marginTop: 12 }}>
                  <label>Товары:</label>
                  <p>{0}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 100,
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <label>Доставка:</label>
                  <p>Текст</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 38,
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <label>Итого:</label>
                  <h3>{
                    total
                  }</h3>
                </div>

                <button
                  onClick={() => {
                    setOrder(true);
                  }}
                >
                  Заказать
                </button>
              </div>
            </section>
          </section>
        ) : (
          <h2 style={{ textAlign: "center" }}>Вы еще ничего не заказали</h2>
        )}
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Cart);
{
  /* <TotalAmount count={count} setCount={setCount}/> */
}
