import React from "react";
import styles from "@/styles/profileBurger.module.css";
import Image from "next/image";
import { Cookie, CookieSetOptions } from "universal-cookie";
import { useRouter } from "next/navigation";

interface Button {
  buttonColor: any;
  setButtonColor: Function;
  setUser: Function
}

const ProfileBurger = ({ buttonColor, setButtonColor, setUser }: Button) => {
  const {push} = useRouter()
  return (
    <div className={styles.ProfileBurger}>
      <div className={styles.profileLeft}>
        <div className={styles.profileCard}>
          <div
            className={styles.profileUser}
            style={
              buttonColor !== 0
                ? { backgroundColor: "#fff" }
                : { backgroundColor: "#E4B717", color: "#fff" }
            }
            onClick={() => {
              setButtonColor(0);
            }}
          >
            <Image
              src={!buttonColor ? "/icons/user.svg" : "/icons/user.svg" }
              width={16}
              height={21}
              alt="user"
            />
            <p>Shaxsiy ma'lumotlar</p>
          </div>
          <div
            className={styles.profileOrder}
            style={
              // @ts-ignore
              buttonColor !== 1
                ? { backgroundColor: "#fff" }
                : { backgroundColor: "#E4B717", color: "#fff" }
            }
            onClick={() => {
              setButtonColor(1);
            }}
          >
            <Image
              src={!buttonColor ? "icons/book.svg" : "icons/bookWhite.svg"}
              width={17.29}
              height={21}
              alt="book"
            />
            <p>Mening buyurtmalarim</p>
          </div>
        </div>
        <div onClick={()=> {
          setUser("userInfo")
          push("/")
        }} className={styles.profileClose}>
          <Image src={"icons/logout.svg"} width={19} height={19} alt="close" />
          <p>Hisobdan chiqish</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBurger;
