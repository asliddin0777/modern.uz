import "@/styles/globals.css";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import axios from "axios";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";

export default function RootLayout({ children, params }: any) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
  return (
    <html lang={locale}>
      <body>
        <TopHeader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}