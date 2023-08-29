import React from "react";
import styles from "@/styles/category.module.css";
import Image from "next/image";
import { uuid as uuidv4 } from 'uuidv4';


interface card {
  selectedProps: string[];
  setSelectedProps: Function;
  handlerFilter: any;
  subcategor: any;
}

const categoryProp = ({
  selectedProps,
  setSelectedProps,
  handlerFilter,
  subcategor,
}: card) => {

  return (
    <div className={styles.categoryProp}>
      <section className={styles.sectionLeft}>
        {subcategor && subcategor.props.Manufacturer?.props && (
          <div className={styles.manufacturer}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.manufacturerTitle}>
                {subcategor.props.Manufacturer.props[0].prop.name}
              </p>
              <Image
                src={"/toparrow.svg"}
                width={15}
                height={12}
                alt="toparrow"
              />
            </div>
            {subcategor &&
              subcategor.props.Manufacturer.props?.map((e: any) => {
                return (
                  <div
                  key={uuidv4()}
                    className={styles.radioInput}
                    onClick={() => {
                      setSelectedProps([e.id]);
                    }}
                  >
                    <input type="radio" name={e.prop.name} />
                    <label>{e.value}</label>
                  </div>
                );
              })}
          </div>
        )}
        {subcategor && subcategor.props.Storage?.props && (
          <div className={styles.operative}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.operativeTitle}>
                {subcategor.props.Storage.props[0].prop.name}
              </p>
              <Image
                src={"/toparrow.svg"}
                width={15}
                height={12}
                alt="toparrow"
              />
            </div>
            {subcategor &&
              subcategor.props.Storage.props?.map((e: any) => {
                return (
                  <div
                    className={styles.checkBoxInput}
                  key={uuidv4()}
                  onClick={() => {
                      setSelectedProps([...selectedProps, e.id]);
                    }}
                  >
                    <input type="radio" name={e.prop.name} />
                    <label>{e.value}</label>
                  </div>
                );
              })}
          </div>
        )}
        {subcategor && subcategor.props.Color?.props && (
          <div className={styles.operative}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.operativeTitle}>
                {subcategor.props.Color.props[0].prop.name}
              </p>
              <Image
                src={"/toparrow.svg"}
                width={15}
                height={12}
                alt="toparrow"
              />
            </div>
            {subcategor &&
              subcategor.props.Color.props?.map((e: any) => {
                return (
                  <div
                    className={styles.checkBoxInput}
                  key={uuidv4()}
                  onClick={() => {
                      setSelectedProps([...selectedProps, e.id]);
                    }}
                  >
                    <input type="radio" name={e.prop.name} />
                    <label>{e.value}</label>
                  </div>
                );
              })}
          </div>
        )}
        {subcategor && subcategor.props.Warranty?.props && (
          <div className={styles.operative}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.operativeTitle}>
                {subcategor.props.Warranty.props[0].prop.name}
              </p>
              <Image
                src={"/toparrow.svg"}
                width={15}
                height={12}
                alt="toparrow"
              />
            </div>
            {subcategor &&
              subcategor.props.Warranty.props?.map((e: any) => {
                return (
                  <div
                  key={uuidv4()}
                  className={styles.checkBoxInput}
                    onClick={() => {
                      setSelectedProps([...selectedProps, e.id]);
                    }}
                  >
                    <input type="radio" name={e.prop.name} />
                    <label>{e.value}</label>
                  </div>
                );
              })}
          </div>
        )}
        {subcategor && subcategor.props.Water_Resistance?.props && (
          <div className={styles.operative}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.operativeTitle}>
                {subcategor.props.Water_Resistance.props[0].prop.name}
              </p>
              <Image
                src={"/toparrow.svg"}
                width={15}
                height={12}
                alt="toparrow"
              />
            </div>
            {subcategor &&
              subcategor.props.Water_Resistance.props?.map((e: any) => {
                return (
                  <div
                    className={styles.checkBoxInput}
                  key={uuidv4()}
                  onClick={() => {
                      setSelectedProps([...selectedProps, e.id]);
                    }}
                  >
                    <input type="radio" name={e.prop.name} />
                    <label>{e.value}</label>
                  </div>
                );
              })}
          </div>
        )}
        <button onClick={handlerFilter} className={styles.apply}>
          Apply
        </button>
      </section>
    </div>
  );
};

export default categoryProp;
