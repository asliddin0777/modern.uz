"use client";

import React, { useEffect, useState } from 'react'
import styles from "@/styles/cart.module.css";
import Order from "@/app/[locale]/components/global/Order";
import IProduct from "@/interfaces/Product/IProduct";
import IPrice from '@/interfaces/Product/IPrice';
interface Counter {
    prices: IPrice[]
    setTotals: Function
    id: string,
    totals: {
        id: string
        sum: number
    }[]
    setAllPrice: Function
}
export default function CouterV2({ prices, setTotals, id, totals, setAllPrice }: Counter) {
    const findPrice = (qty: number) => prices.find(p => {
        if (p.qtyMin <= qty && qty < p.qtyMax) {
            console.log(p);
            return p;
        }
        ;
    }) || prices[prices.length - 1]




    const [count, setCount] = useState(1)
    const [currentPrice, setPrice] = useState<IPrice>(prices[0])
    const decrement = () => {
        setCount(prev => prev > 1 ? prev - 1 : 1)
    }
    const increment = () => {
        setCount(prev => prev + 1)
    }
    useEffect(() => {
        if (currentPrice.qtyMin >= count || count > currentPrice.qtyMax) {

            setPrice(findPrice(count))
            totals.find(tot => tot.id === id ? tot.sum = count * currentPrice.price : "")
            setAllPrice(totals.reduce((sum, tot) => sum + tot.sum, 0))
            
        }

    }, [])
    useEffect(() => {
        setPrice(findPrice(count));
        setTotals((prev: {
            id: string
            sum: number
        }[])=> prev.map(t => {
            
                if(t.id===id){
                    return {id, sum:count*currentPrice.price}
                }
                return t;
        }));
    }, [count])
    return (
        <>
            <div className={styles.countButton}>
                <button onClick={decrement}>-</button>
                <p>{count}</p>
                <button onClick={increment}>+</button>
                {/* {order === true && <Order order={order} setOrder={setOrder} selectedProduct={selectedPr} counts={count} totalPrice={count} />} */}
            </div>
            <div className={styles.totalCounter}>
                <h3>Итого:</h3>
                <p className={styles.totalCounter}>{count * currentPrice.price}</p>
            </div>
        </>
    )
}
