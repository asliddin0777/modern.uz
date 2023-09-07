"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "@/styles/selectCategory.module.css";
import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { uuid as uuidv4 } from "uuidv4";

interface Categories {
  categories: any | any[];
  selected: string;
}

const SelectCategory = ({ categories, selected }: Categories) => {
  const [subcategory, setSubcategory] = useState<any[] | any>([]);
  const [load, setLoad] = useState(true);
  const [hovered, setHovered] = useState<any>("");

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`)
      .then((res: any) => {
        setSubcategory(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  }, []);

  if (hovered && subcategory) {
    const hvd = subcategory.find((dt: any) => dt.id === hovered.id);
  }

  console.log(categories)
  return (
    <div className={styles.selectCategory}>
      <section className={styles.categorSection}>
        <div className={styles.leftSide}>
          {categories &&
            categories?.map((e: any, index: number) => {
              return (
                <div key={uuidv4()} className={styles.categorLeft}>
                  <div
                    onMouseOver={() => {
                      setHovered(e);
                    }}
                    className={styles.iconOfCat}
                  >
                    <Link href={`/category/${e.id.toLocaleLowerCase()}`}>{e.name}</Link>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.categorRight}>
          <ul>
            {hovered !== "" &&
              hovered.subcategories.map((e: any, index: number) => {
                return (
                  <li key={index}>
                    <Link
                      key={index}
                      style={{ color: "#666565" }}
                      href={`/category/${e.id.toLocaleLowerCase()}`}
                    >
                      {e.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SelectCategory;
