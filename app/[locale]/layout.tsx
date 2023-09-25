import "@/styles/globals.css";
import { useLocale } from "next-intl";
// import { notFound } from "next/navigation";
import axios from "axios";
import TopHeader from "./components/global/TopHeader";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import Loader from "./components/local/Loader";
// export const metadata = {
//   title: "Home"
// }
export default function RootLayout({ children, params }: any) {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
  // const locale = useLocale();
  // // Show a 404 error if the user requests an unknown locale
  // if (params.locale !== locale) {
  //   notFound();
  // }
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