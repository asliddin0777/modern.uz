"use client";
import styles from "@/styles/category.module.css";
import Header from "../components/global/Header";
import Image from "next/image";
import Card from "../components/global/Card";
import Footer from "../components/global/Footer";
import { useState, useEffect, memo } from "react";
import TopHeader from "../components/global/TopHeader";
import Categories from "../components/global/Categories";
import CardBurger from "../components/local/CardBurger";
import axios from "axios";
import Loader from "../components/local/Loader";
import { usePathname, useRouter } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
import CategoryProp from "../components/local/CategoryProp";

const Page = () => {
  const [cardBurger, setCardBurger] = useState<boolean>(false);
  const [subcategor, setSubcategory] = useState<any[] | any>();
  const [load, setLoad] = useState<boolean>(true);
  const [selectedProps, setSelectedProps] = useState<any[] | any>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    { page: number; products: IProduct[]; limit: number } | undefined>();
  const [likedObj, setLikedObj] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [data, setData] = useState(false)
  const {push} = useRouter()

  const cardBurgerHandler = () => {
    setCardBurger(!cardBurger);
  };
  push("/")
  return <>wefwefuihwfey gweyfug wytefg wyefgytwefguywef</>
}

export default memo(Page)
