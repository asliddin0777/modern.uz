"use client";
import React, { useState, memo } from "react";
import styles from "@/styles/selectCategory.module.css";
import Link from "next/link";

interface Categories {
  categories: any | any[];
}

const SelectCategory = ({ categories }: Categories) => {
  const [hovered, setHovered] = useState<any>("");
  return (
    <div className={styles.selectCategory}>
      <section className={styles.categorSection}>
        <div className={styles.leftSide}>
          {categories &&
            categories?.map((e: any, index: number) => {
              return (
                <div key={e.id} className={styles.categorLeft}>
                  <div
                    onMouseOver={() => {
                      setHovered(e);
                    }}
                    className={styles.iconOfCat}
                  >
                    <Link href={`/category/${e.name}?id=${e.id}`}>
                      {e.name}
                    </Link>
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
                      href={`/category/${e.name}?id=${e.id.trim()}`}
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

export default memo(SelectCategory);
