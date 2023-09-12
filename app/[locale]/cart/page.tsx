"use client"
import React, { useContext } from "react";
import styles from "@/styles/cart.module.css";
import Image from "next/image";
import Footer from "../components/global/Footer";
import { useState, useEffect } from "react";
import TopHeader from "../components/global/TopHeader";
import Header from "../components/global/Header";
import Categories from "../components/global/Categories";
import Order from "../components/global/Order";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loader from "../components/local/Loader";
import Counter from "@/utils/Counter";
import { uuid as uuidv4 } from 'uuidv4';
import Error from "../components/local/Error";
import IUser from "@/interfaces/IUser";
import { CartContext } from "../layout";




const Cart = () => {
  const [order, setOrder] = useState<boolean>(false);
  const [load, setLoad] = useState(true);
  const [count, setCount] = useState(0);
  const [selectedType, setSelectedType] = useState<any[] | any>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [countCookie, setCountCookie] = useCookies(["count"])
  const [data, setData] = useState<any | any[]>([]);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [cookie] = useCookies(["aboutUser"]);
  const [userInform] = useCookies(["userInfo"]);
  const [selectedCards] = useCookies(["selectedCard"]);
  const { aboutUser } = cookie;
  const { selectedCard } = selectedCards;
  const { userInfo } = userInform;

  const [user, setUser] = useState()

  useEffect(() => {
    order
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [order]);

  const [err, setErr] = useState<string>("")
  const [error, setError] = useState<boolean>(false)
  const [cart, setCart] = useState([])
  useEffect(() => {
    setLoad(true)
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`)
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`)
        const user = await axios.get("/products/liked", {
          headers: {
            Authorization: userInfo === undefined ? "" : userInfo.userToken
          }
        })
        const cart = await axios.get("/users/current", {
          headers: {
            Authorization: userInfo === undefined ? "" : userInfo.userToken
          }
        })
        const [res1, res2, us, ctr] = await axios.all([categories, subCategories, user, cart])
        setCategories(res1.data)
        setSubCategories(res2.data)
        setUser(us.data)
        setCart(ctr.data.basket)
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false)
      }
    }
    fetchData()
  }, [])


  console.log(cart);


  const cartedIn = useContext(CartContext)

  console.log(cartedIn);

  const [cartedProducts] = useCookies(["inCart"])
  const {inCart} = cartedProducts
  console.log(inCart);

  if (!load) {
    return (
      <div className={styles.Delivery}>
        <TopHeader />
        <Header />
        <Categories categories={categories} subcategories={subCategories} />
        <Order selectedProduct={inCart} order={order} setOrder={setOrder} />
        <div className={styles.cart}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Корзина</h1>
        </div>
        <Error err={error} msg={err} setErr={setError} />
        {inCart ? (
          <section className={styles.DeliverySection}>
            <section className={styles.sectionLeft}>
              {inCart &&
                inCart?.map((card: any, index: number) => {
                  return (
                    <div key={uuidv4()} className={styles.card}>
                      <input className={styles.input} type="checkbox" />
                      <Image
                        src={
                          card.media?.length > 0
                            ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${card.media[0].name}`
                            : "/icons/bag.svg"
                        }
                        width={90}
                        height={100}
                        alt="img"
                      />
                      <div className={styles.menu}>
                        <h1>
                          {card
                            ? card.name
                            : `Phone named something ${card.productId}`}
                        </h1>
                        <p style={{ color: "#B7AFAF" }}>
                          {card.subcategory
                            ? card.subcategory.name
                            : "Artel"}
                        </p>
                        <div
                          style={{ display: "flex", gap: 10, paddingTop: 7 }}
                        >
                          <label>Цвет:</label>
                          <p>{card.color ? card.color : "Зеленый"}</p>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <label>Встроенная память:</label>
                          <p>{card.memory ? card.memory : "256 гб"}</p>
                        </div>
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
                          <Counter
                            price={card.price[0].price}
                            count={count}
                            setCount={setCount}
                          />
                        </div>
                      </div>
                      <div className={styles.countPrice}>
                        <div className={styles.remove}>
                          <Image
                            src={"/icons/remove.svg"}
                            width={14}
                            height={16}
                            alt="remove"
                          />
                          <p>Удалить</p>
                        </div>
                        <h1>
                          {card.product
                            ? `${card.price[0].price}`
                            : "900"}
                        </h1>
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
                  <p>8.000.000 сум</p>
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
                  <h3>{count}</h3>
                </div>

                <button
                  onClick={() => {
                    setOrder(true);
                    setCountCookie("count", {

                    })
                  }}
                >
                  Заказать
                </button>
              </div>
            </section>
          </section>
        ) : (
          <h2 style={{ textAlign: "center" }}>
            You didnt ordered anything yet
          </h2>
        )}
        <Footer />
      </div>
    );
  } else {
    return <Loader />
  }
};

export default Cart;
{
  /* <TotalAmount count={count} setCount={setCount}/> */
}
