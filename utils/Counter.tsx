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
  const [pricer, setPrice] = useState<{
    price: number;
    oldPrice: number;
    qtyMin: number;
    qtyMax: number;
  }>()
  const [totalPrice, setTotalPrice] = useState<number>(1)
  const findPrice = (qty: number) => price.find(p => {
    if (p.qtyMin <= qty && qty <= p.qtyMax) {
      return p;
    }
    ;
  }) || price[price.length - 1]
  useEffect(() => {
    setTotalPrice(counts * findPrice(counts).price)
    // setCount(1)
    // setCount(count*findPrice(counts).price)
  }, [counts])
  const increment = () => {
    setCounts(counts + 1)
  };

  const decrement = () => {
    if (counts > 1) {
      setCounts(counts - 1)
      // setCount(prev => {
      //   const p = findPrice(counts)
      //   console.log(p);
      //   return count - p.price
      // })
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
