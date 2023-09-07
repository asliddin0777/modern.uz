import React, { useState } from "react";
import styles from "@/styles/category.module.css";
import Image from "next/image";
import { uuid as uuidv4 } from "uuidv4";
import { ISubcategory } from "@/interfaces/ISubcategory";

interface card {
  selectedProps: string[];
  setSelectedProps: Function;
  handlerFilter: any;
  subcategor: ISubcategory;
  selectedProduct: any;
}

const categoryProp = ({
  selectedProps,
  setSelectedProps,
  handlerFilter,
  subcategor,
  selectedProduct,
}: card) => {
  return (
    <div className={styles.categoryProp}>
      <section className={styles.sectionLeft}>
        {subcategor && subcategor.props.length > 0 ? (
          <>
            {subcategor.props.map((p) => (
              <div key={p.id} className={styles.manufacturer}>
                <div className={styles.manufacturerTitle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className={styles.operativeTitle}>{p.name} </p>
                    <Image
                      src={"/toparrow.svg"}
                      width={15}
                      height={12}
                      alt="toparrow"
                    />
                  </div>
                </div>
                {p.values.map((v) => (
                  <div key={v.id}>
                    <div
                      className={styles.checkBoxInput}
                      onClick={() => {
                        setSelectedProps([...selectedProps, v.id]);
                      }}
                    >
                      <input type="radio" name={p.name} />
                      <label>{v.value}</label>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={handlerFilter} className={styles.apply}>
              Apply
            </button>
          </>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default categoryProp;
