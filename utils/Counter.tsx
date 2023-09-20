"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import styles from "@/styles/cart.module.css";

interface Counts {
  count: number;
  setCount: Function;
  price: number;
  qtyMin: number;
  qtyMax: number;
}

const Counter = ({ count, setCount, price, qtyMax, qtyMin }: Counts) => {
  const [counts, setCounts] = useState<number>(0);


  const increment = () => {
    setCounts(counts + qtyMax);
    setCount(count + price);
  };

  const decrement = () => {
    if (counts > 0) {
      setCounts(counts - qtyMin);
    }
    if (counts > 0) {
      setCount(count - price);
    }

  };

  return (
    <div className={styles.countButton}>
      <button onClick={decrement}>-</button>
      <p>{counts}</p>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
