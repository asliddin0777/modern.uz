import "@/styles/globals.css";
import { useLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";
import axios from "axios";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import Loader from "./components/local/Loader";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Modern Shop",
  description: "Online shop - Modern Shop uz, ",
  icons: "/images/modernshop.jpg"
}
const locales = ['ru', 'uz']
import { NextIntlClientProvider } from 'next-intl';
// import { unstable_setRequestLocale } from 'next-intl/server';


export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }];
}

export default function RootLayout({ children, params }: any) {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
  const locale = useLocale();
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) redirect("/ru");
  // // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    redirect("/ru")
  }
  return (
    <html>
      <body>
        <TopHeader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}