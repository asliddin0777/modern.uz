"use client"
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Loader from "./components/local/Loader";
import Footer from "./components/global/Footer";
const inter = Inter({ subsets: ["latin"] });
export const CartContext = createContext({})

export default function RootLayout({ children, params }: any) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }
  const [load, setLoad] = useState<boolean>(true);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const cat = axios.get(`/categories`);
        const sub = axios.get(`/subcategories`);
        const [ca, su] = await axios.all([cat, sub]);
        setSubCategories(ca.data);
        setCategories(su.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
  const [inCart, setInCart] = useState([])
  if (load === false && categories.length > 0 && subCategories.length > 0) {
    return (
      <CartContext.Provider value={{ inCart, setInCart }}>
        <html lang={locale}>
          <body>
            <TopHeader />
            <Header />
            {children}
            <Footer />
          </body>
        </html>
      </CartContext.Provider>
    );
  } else {
    return <CartContext.Provider value={{ inCart, setInCart }}>
      <html lang={locale}>
        <body>
          <Loader />
        </body>
      </html>
    </CartContext.Provider>
  }
}
