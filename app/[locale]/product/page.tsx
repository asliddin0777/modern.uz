"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import IProduct from "@/interfaces/Product/IProduct";
import Card from "../components/global/Card";
import styles from "@/styles/company.module.css";
import Categories from "../components/global/Categories";

const Page = () => {
  const [data, setData] = useState<any[] | any>();
  const [load, setLoad] = useState<boolean>(true);
  const [refetch, setRefetch] = useState(false);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products`)
      .then((res: any) => {
        setData(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  }, [data]);

  return (
    <div>
      <Categories categories={categories} subcategories={subCategories} />

      <div className={styles.container}>
        <section className={styles.companyCards}>
          {data &&
            data.products &&
            data.products.map((e: IProduct) => {
              return (
                <Card
                  isLiked
                  setLikedObj={() => {}}
                  setData={setRefetch}
                  card={e}
                  animation="fade-down"
                  cat={e.subcategory.name}
                  url={e.id}
                  height={300}
                  width={300}
                  image={
                    e.media.length > 0
                      ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[0]?.name}`
                      : "/images/noImg.jpg"
                  }
                  title={e.name}
                  price={String(e.price[0].price)}
                  key={e.id}
                />
              );
            })}
        </section>
      </div>
    </div>
  );
};

export default Page;
