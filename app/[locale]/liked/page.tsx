"use client"
import React, { useEffect, useState } from "react";
import styles from "@/styles/liked.module.css";
import Categories from "../components/global/Categories";
import Loader from "../components/local/Loader";
import axios from "axios";
import useCookies from "react-cookie/cjs/useCookies";
import IProduct from "@/interfaces/Product/IProduct";
import Card from "../components/global/Card";
export default function Liked() {
  const [likedObj, setLikedObj] = useState<any[] | any>([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true)
  const [user, setUser] = useState<IProduct[]>([])
  const [cookie] = useCookies(['userInfo'])
  const [refetch, setRefetch] = useState(false)
  const { userInfo } = cookie
  useEffect(() => {
    setLoad(true)
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`)
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`)
        const user = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/liked`, {
          headers: {
            Authorization: userInfo === undefined ? "" : userInfo.userToken
          }
        })
        const [res1, res2, us] = await axios.all([categories, subCategories, user])
        setCategories(res1.data)
        setSubCategories(res2.data)
        setUser(us.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await axios.get(`${process.env.NEXT_PUBLIC_API}/products/liked`, {
          headers: {
            Authorization: userInfo === undefined ? "" : userInfo.userToken
          }
        })
        const [us] = await axios.all([user])
        setUser(us.data)
      } catch (err) {
        console.log(err);
      }
    }
    fetchData()
  }, [refetch])

  if (load === false) {
    return (
      <div className={styles.liked}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.Favorites}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Избранное</h1>
        </div>
        <section className={styles.likedSection}>
          <div className={styles.newProductsWrapper}>
            {user ? user.map((card, index) => {
              return <Card
                animation="fade-down"
                cat={card.subcategory.name}
                url={card.id}
                height={300}
                width={300}
                image={
                  card.media.length
                    ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${card.media[0]?.name}`
                    : "/icons/bag.svg"
                }
                title={card.name}
                price={`${card.price[0].price}`}
                key={card.id}
                isLiked
                setData={setRefetch}
                card={card}
                likedObj={likedObj}
                setLikedObj={()=> {}}
              />
            }) : "sign in"}
            {user.length === 0 && <h2 style={{ textAlign: "center" }}>You didnt like a product yet</h2>}
          </div>
        </section>
      </div>
    );
  } else {
    return <Loader />;
  }
};
