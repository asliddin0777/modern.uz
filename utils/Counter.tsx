"use client";
import React, { memo, useEffect } from "react";
import { useState } from "react";
import styles from "@/styles/cart.module.css";
import Order from "@/app/[locale]/components/global/Order";
import IProduct from "@/interfaces/Product/IProduct";

interface Counts {
  count: number;
  setCount: Function;
  price: {
    price: number;
    oldPrice: number;
    qtyMin: number;
    qtyMax: number;
  }[];
  order: boolean;
  setOrder: Function;
  selectedPr: IProduct[]
  cart: IProduct[]
}

const Counter = ({ count, setCount, price, order, setOrder, selectedPr, cart }: Counts) => {
  const [counts, setCounts] = useState<number>(1);
  const [pricer, setPrice] = useState<{
    price: number;
    oldPrice: number;
    qtyMin: number;
    qtyMax: number;
  }>()
  const [totalPrice, setTotalPrice] = useState<number>(1)
  const [pp, setPp] = useState(1)
  const findPrice = (qty: number) => price.find(p => {
    if (p.qtyMin <= qty && qty <= p.qtyMax) {
      console.log(p);
      return p;
    }
    ;
  }) || price[price.length - 1]
  console.log(cart);
  useEffect(() => {
    setTotalPrice(counts * findPrice(counts).price)
  }, [counts])
  
  const increment = () => {
    console.log(totalPrice, "  ", pp);
    setCounts(counts + 1)
    setCount(count - count + totalPrice + findPrice(counts).price)

    // if (counts > 1 && findPrice(counts-1).price - findPrice(totalPrice).price === 0) {
    // } else {
    //   setCount(counts * findPrice(totalPrice).price)
  }
  // console.log(count, " / ",findPrice(totalPrice).price," ", findPrice(counts).price);

  const decrement = () => {
    if (counts > 1) {
      setCounts(counts - 1)
      setCount(count - findPrice(counts - 1).price)
    } else {
      setCounts(1)
    }
  };

  // console.log(counts);

  return (
    <>
      <div className={styles.countButton}>
        <button onClick={decrement}>-</button>
        <p>{counts}</p>
        <button onClick={increment}>+</button>
        {order === true && <Order order={order} setOrder={setOrder} selectedProduct={selectedPr} counts={count} totalPrice={count} />}
      </div>
      <div className={styles.totalCounter}>
        <h3>Итого:</h3>
        <p className={styles.totalCounter}>{totalPrice}</p>
      </div>
    </>
  );
};

export default memo(Counter);
