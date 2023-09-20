"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import styles from "@/styles/cart.module.css";

interface Counts {
  count: number;
  setCount: Function;
  price: {
    price:number,
    oldPrice:number,
    qtyMin:number,
    qtyMax:number
  }[];
}

const Counter = ({ count, setCount, price }: Counts) => {
  const [counts, setCounts] = useState<number>(1);
  console.log(price)

  const increment = () => {

      setCounts(counts + 1);
  if (counts > 5){
    setCount(count + price[1].price);
  }    else {
    setCount(count+price[0].price)
  }
  };

  const decrement = () => {
    if (counts > 1) {
      setCounts(counts - 1);
    }
    if (counts > 1) {
      if(counts > 5) {
        setCount(count - price[1].price);
      }else{
        setCount(count - price[0].price);
      }
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
