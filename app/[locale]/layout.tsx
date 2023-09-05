"use client"
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children, params }: any) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }

  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
 
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
