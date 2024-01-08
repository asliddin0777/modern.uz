import "@/styles/globals.css";
import axios from "axios";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Modern Shop",
  description: "Online shop - Modern Shop uz, ",
  icons: "/images/modernshop.jpg"
}

export default function RootLayout({ children, params }: any) {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
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