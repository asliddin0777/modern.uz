import React, { useEffect, useState } from "react";
import styles from "@/styles/cart.module.css";
import { useCookies } from "react-cookie";

interface Counts {
  count: number;
  setCount: Function;
  price: number
}

const Counter = ({ count, setCount, price }: Counts) => {
  const [counts, setCounts] = useState<number>(0);



  const increment = () => {
    setCounts(counts + 1);
    setCount(count + price); 
  };

  const decrement = () => {
    setCounts(count > 1 ? counts - 1 : 1);
    setCount(count - price);
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
