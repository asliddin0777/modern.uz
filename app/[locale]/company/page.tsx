"use client";

import React, { memo, cache } from "react";
import styles from "@/styles/company.module.css";
import Categories from "../components/global/Categories";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Loader from "../components/local/Loader";
import useCookies from "react-cookie/cjs/useCookies";
import { useRouter } from "next/navigation";
const Company = () => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chat, setChat] = useState();
  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;
  const { push } = useRouter()
  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const subCategories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/vendors`
        );
        const [res1, res2, dataget] = await axios.all([
          categories,
          subCategories,
          data,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setData(dataget.data);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  const [data, setData] = useState<object[] | any>([]);

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

    var color = "rgb(" + r + ", " + g + ", " + b + ")";

    return color;
  }

  if (!load) {
    return (
      <div className={styles.company}>
        <Categories categories={categories} subcategories={subCategories} />
        <div className={styles.container}>
          {data &&
            data.map((e: any, index: number) => {
              return (
                <div className={styles.cards} key={e.id}>
                  <div className={styles.card__left}>
                    <Link
                      style={{
                        color: "#000",
                      }}
                      href={`/company/${e.id}`}
                      as={`/company/${e.name.split(" ").join("-")}?id=${e.id}`}
                      className={styles.card__title}
                    >
                      {/* <Image
                              src={"/icons/profile.svg"}
                              height={57}
                              width={57}
                              alt="profile"
                            /> */}
                      <div
                        className={styles.profileImage}
                        style={{
                          background: `${getRandomColor()}`,
                        }}
                      >
                        {e.name[0]}
                      </div>
                      <div>
                        <h3>{e.name}</h3>
                      </div>
                    </Link>
                    <div className={styles.description}>
                      <p>Описание</p>
                      <p>{e.description}</p>
                    </div>
                  </div>
                  <div className={styles.card__right}>
                    <div className={styles.cards__button}>
                      <button
                        onClick={() => {
                          push(`/company/${e.name.split(" ")[0]}?id=${e.id}`);
                        }}
                      >
                        Посмотреть все товары
                      </button></div></div>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default memo(Company);
