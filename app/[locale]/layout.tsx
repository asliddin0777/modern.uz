"use client"
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import axios from "axios";
import { createContext, useContext, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
export const CartContext = createContext({})

export default function RootLayout({ children, params }: any) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
  const [inCart, setInCart] = useState([])
  return (
    <CartContext.Provider value={{ inCart, setInCart }}>
      <html lang={locale}>
        <body>{children}</body>
      </html>
    </CartContext.Provider>
  );
}
