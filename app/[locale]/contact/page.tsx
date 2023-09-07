"use client"
import React, { useEffect, useState } from "react";
import TopHeader from "../components/global/TopHeader";
import Header from "../components/global/Header";
import Categories from "../components/global/Categories";
import Image from "next/image";
import Footer from "../components/global/Footer";
import styles from "@/styles/contact.module.css";
import Link from "next/link";
import axios from "axios";
import Icons from "../components/local/Icons";

const Contact = () => {
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/categories`);
        const subCategories = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/subcategories`);
        const [res1, res2] = await axios.all([categories, subCategories]);
        setCategories(res1.data);
        setSubCategories(res2.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  const phoneObj = [
    {
      title: "заводской номер",
      number: "+998 99 999 99 99"
    },
    {
      title: "доставка номер",
      number: "+998 99 999 99 99"
    },
    {
      title: "колл-центр номер",
      number: "+998 99 999 99 99"
    },
  ]

  const Submit = (e: React.FormEvent<HTMLFormElement> | any): void => {
    e.preventDefault()
    const data = new FormData(e.target)
    const obj = Object.fromEntries(data.entries())
    const send = `name: ${obj.name}%0Atitle: ${obj.title}%0Aphone: ${obj.phoneNumber}%0Amessage: ${obj.message}`
    axios({
        method: "post",
        url: `https://api.telegram.org/bot6306734073:AAHd8DekE-bnRW1yv2bJrBUAU8dH6nUziLw/sendMessage?chat_id=5356847426&text=${send}`
    }).catch(err => console.log(err))
}

  
  return (
    <div className={styles.container}>
      <TopHeader />
      <Header />
      <Categories categories={categories} subcategories={subCategories} />
      <div className={styles.contactTitle}>
        <h3>Контакты</h3>
      </div>
      <div className={styles.contact}>
        <div className={styles.connection}>
          <div className={styles.contactCard}>
            <h3>Номера телефонов для связи:</h3>
            <div className={styles.phone}>
              {phoneObj.map(({title, number}, index: number) => {
                return (
                  <div className={styles.connection}>
                    <h4>{title}</h4>
                    <div className={styles.phoneNumber}>
                      <Image
                        src={"icons/contact.svg"}
                        width={19}
                        height={19}
                        alt="svg"
                      />
                      <Link href="tel:+ 998 99 999 99 99">
                       {number}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.contactCard}>
            <h3>Почта для связи:</h3>
            <div className={styles.phone}>
              <Icons />
            </div>
          </div>
        </div>
        <form className={styles.contactForm} onSubmit={Submit}>
          <h3>Написать обращение</h3>
          <div className={styles.contactInput}>
            <div>
              <p>Ф.И.О.</p>
              <input name="name" className={styles.input} />
            </div>

            <div className={styles.inputContainer}>
              <p>Тема обращения</p>
              <input name="title" className={styles.input} />
            </div>

            <div className={styles.inputContainer}>
              <p>Номер телефона</p>
              <input name="phoneNumber" maxLength={13} className={styles.input} />
            </div>

            <div className={styles.inputContainer}>
              <p>Текст обращения</p>
              <textarea name="message" maxLength={250} className={styles.input} />
            </div>
          </div>
          <button onClick={() => {
            alert('we will contact you soon')
          }}>Отправить</button>
        </form>
      </div>
      <div style={{ marginTop: "11rem" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;

  