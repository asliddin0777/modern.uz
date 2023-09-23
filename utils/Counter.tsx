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
}

const Counter = ({ count, setCount, price, order, setOrder, selectedPr }: Counts) => {
  const [counts, setCounts] = useState<number>(1);
  console.log(price);
  const increment = () => {
    if (price) {
      price.map(pr => {
        if (counts < pr.qtyMax) {
          if (counts  < pr.qtyMax) {
            setCounts(counts + 1);
            setCount(count + pr.price);
            console.log(count)
          }
          } else {
            setCount(count);
            setCounts(counts);
            console.log(count, "1");
          }
      })
    }
  };

  const decrement = () => {
    if (counts > 1) {
      setCounts(counts - 1);
    }
    if (counts > 1) {
      if (counts > 5) {
        setCount(count - price[1].price);
      } else {
        setCount(count - price[0].price);
      }
    }
  };

  return (
    <div className={styles.countButton}>
      <button onClick={decrement}>-</button>
      <p>{counts}</p>
      <button onClick={increment}>+</button>
      {order === true && <Order order={order} setOrder={setOrder} selectedProduct={selectedPr} counts={count} totalPrice={count }/>}
    </div>
  );
};

export default memo(Counter);
