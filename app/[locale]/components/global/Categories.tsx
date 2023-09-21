"use client";
import React, { memo, useState } from "react";
import styles from "@/styles/categories.module.css";
import Image from "next/image";
import Link from "next/link";
import SelectCategory from "./SelectCategory";
interface ISelectCategory {
  categories: any[];
  subcategories: any[];
}

const Categories = ({ categories, subcategories }: ISelectCategory) => {
  const [isCategoryOpen, setCategoryOpen] = useState<boolean>(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  return (
    <>
      <div
        className={styles.categories}
        onMouseLeave={() => {
          setCategoryOpen(false);
        }}
      >
        <div className={styles.container}>
          {subcategories ? (
            <>
              <div
                onClick={() => {
                  setCategoryOpen(!isCategoryOpen);
                }}
                className={!isCategoryOpen ? styles.categ : styles.close}
              >
                <h3>Все категории</h3>
                <Image
                  src={
                    !isCategoryOpen
                      ? "/icons/categories.svg"
                      : "/icons/modernClose.svg"
                  }
                  width={18}
                  height={18}
                  alt="just categories"
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <ul
            className={styles.selectList}
            onMouseOut={() => {
              setCategoriesOpen(false);
            }}
          >
            {categories &&
              categories.map((e: any, index: number) => {
                if (index < 6) {
                  return (
                    <li
                      className={styles.selectItem}
                      key={e.id}
                    >
                      <Link href={`/category/${e.name}?=id${e.id}`}>
                        {e.name}
                      </Link>
                    </li>
                  );
                } else {
                  return "";
                }
              })}
          </ul>
          {isCategoryOpen && (
            <SelectCategory categories={categories} />
          )}
          {isCategoriesOpen && (
            <SelectCategory categories={categories} />
          )}
        </div>
      </div>
    </>
    );
};

export default memo(Categories);
