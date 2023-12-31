import React from "react";
import Image from "next/image";
import styles from "@/styles/contact.module.css";
import Link from "next/link";
const Icons = () => {
  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.button}>
        <div className={styles.icon}>
          <Image src={"/icons/faceB.svg"} width={40} height={40} alt="ss" />
        </div>
        <span>Facebook</span>
      </div>
      <div className={styles.button}>
        <div className={styles.icon}>
          <Image src={"/icons/gmail.svg"} width={30} height={30} alt="ss" />
        </div>
        <span>Gmail</span>
      </div> */}
      <Link target="_blank" href={"https://www.instagram.com/modern_shop.uz/"} className={styles.button}>
        <div className={styles.icon}>
          <Image src={"/icons/instagram.svg"} width={30} height={30} alt="ss" />
        </div>
        <span>Instagram</span>
      </Link>
      {/* <div className={styles.button}>
        <div className={styles.icon}>
          <Image src={"/icons/telegram.svg"} width={30} height={30} alt="ss" />
        </div>
        <span>Telegram</span>
      </div>
      <div className={styles.button}>
        <div className={styles.icon}>
          <Image src={"/icons/youtube.svg"} width={30} height={30} alt="ss" />
        </div>
        <span>YouTube</span>
      </div> */}
    </div>
  );
};

export default Icons;
