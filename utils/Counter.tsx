"use client";
import React from "react";
import { useState } from "react";
import styles from "@/styles/cart.module.css";

interface Counts {
  count: number;
  setCount: Function;
  price: number;
}

const Counter = ({ count, setCount, price }: Counts) => {

  const [counts, setCounts] = useState<number>(count);


  const increment = () => {
    setCounts(counts + 1)
    setCount(count + price);   
  }

  const decrement = () => {
    setCounts(count > 1 ? counts - 1 : 0);
    setCount(count  > price ? price - 0 : 0);
  }


  return (
    <div className={styles.countButton}>
      <button onClick={decrement}>-</button>
      <p>{counts / price}</p>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
