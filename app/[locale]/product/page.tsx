"use client";
import React, { cache } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import IProduct from "@/interfaces/Product/IProduct";
import Card from "../components/global/Card";
import styles from "@/styles/company.module.css";
import Categories from "../components/global/Categories";
import { IPage } from "@/interfaces/IPage";

const Page = ({ searchParams }: {
  searchParams: {
    id: string
  }
}) => {
  const [data, setData] = useState<any[] | any>();
  const [load, setLoad] = useState<boolean>(true);
  const [refetch, setRefetch] = useState(false);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [popularProducts, setPopularProducts] = useState<IProduct[]>([])
  const [subCategories, setSubCategories] = useState<any[] | any>([]);

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const req2 = axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const req1 = axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`);
        const popularProducts = await axios.get<IPage>(`${process.env.NEXT_PUBLIC_API}/api/products?popularProducts=true`)
        const [res1, res2] = await axios.all([req1, req2]);
        setPopularProducts(popularProducts.data.products)
        setSubCategories(res1.data);
        setCategories(res2.data);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products`)
      .then((res: any) => {
        setData(res.data);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [data]);
  return (
    <div>
      <Categories categories={categories} subcategories={subCategories} />
      <div className={styles.container}>
        <section className={styles.companyCards}>
          {searchParams.id === undefined ? data &&
            data.products &&
            data.products.map((e: IProduct) => {
              return (
                <Card
                  isLiked
                  setLikedObj={() => { }}
                  setData={setRefetch}
                  card={e}
                  animation="fade-down"
                  cat={e?.subcategory?.name}
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
            }) : popularProducts && popularProducts.map((e) => {
              return (
                <Card
                  isLiked
                  setLikedObj={() => { }}
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
              )
            })}
        </section>
      </div>
    </div>
  );
};

export default Page;
