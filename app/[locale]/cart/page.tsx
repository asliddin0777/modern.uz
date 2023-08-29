"use client"
import React from "react";
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

  useEffect(() => {
    order
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [order]);


  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`);
        const [res1, res2] = await axios.all([categories, subCategories]);
        setCategories(res1.data);
        setSubCategories(res2.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);





  if (!load) {
    return (
      <div className={styles.Delivery}>
        <TopHeader />
        <Header />
        <Categories categories={categories} subcategories={subCategories}/>
        <Order selectedProduct={selectedCard} order={order} setOrder={setOrder} />
        <div className={styles.cart}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Корзина</h1>
        </div>
        {selectedCard ? (
          <section className={styles.DeliverySection}>
            <section className={styles.sectionLeft}>
              {selectedCard &&
                selectedCard?.map((card: any, index: number) => {
                  return (
                    <div key={uuidv4()} className={styles.card}>
                      <input className={styles.input} type="checkbox" />
                      <Image
                        src={
                          card.media?.length
                            ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${card.product.media[1].name}`
                            : "/images/14.png"
                        }
                        width={90}
                        height={100}
                        alt="img"
                      />
                      <div className={styles.menu}>
                        <h1>
                          {card.product
                            ? card.product.name
                            : `Phone named something ${card.productId}`}
                        </h1>
                        <p style={{ color: "#B7AFAF" }}>
                          {card.product.subcategory
                            ? card.product.subcategory.name
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
                            price={card.product.price[0].price}
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
                            ? `${card.product.price[0].price}`
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
