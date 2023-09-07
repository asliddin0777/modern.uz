"use client";
import styles from "@/styles/category.module.css";
import Header from "../../components/global/Header";
import Image from "next/image";
import Card from "../../components/global/Card";
import Footer from "../../components/global/Footer";
import { useState, useEffect } from "react";
import TopHeader from "../../components/global/TopHeader";
import Categories from "../../components/global/Categories";
import CardBurger from "../../components/local/CardBurger";
import axios from "axios";
import Loader from "../../components/local/Loader";
import { usePathname, useRouter } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
import CategoryProp from "../../components/local/CategoryProp";

export default function Page() {
  const [cardBurger, setCardBurger] = useState<boolean>(false);
  const [subcategor, setSubcategory] = useState<any[] | any>();
  const [load, setLoad] = useState<boolean>(true);
  const [selectedProps, setSelectedProps] = useState<any[] | any>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    { page: number; products: IProduct[]; limit: number } | undefined
  >();
  const [likedObj, setLikedObj] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);

  const cardBurgerHandler = () => {
    setCardBurger(!cardBurger);
  };

  const router = useRouter();

  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products`, {
        params: {
          category: pathname.split("/")[pathname.split("/").length - 1],
        },
      })
      .then((res: any) => {
        setSelectedProduct(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  }, []);

  useEffect(() => {
    setLoad(true);
    console.log(pathname);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products/`, {
        params: {
          subcategory: pathname.split("/")[pathname.split("/").length - 1],
        },
      })
      .then((res: any) => {
        setSelectedProduct(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  }, []);

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const categories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/categories`
        );
        const subCategories = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories`
        );
        const subCategory = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/subcategories/${
            pathname.split("/")[pathname.split("/").length - 1]
          }`
        );
        const [res1, res2, res3] = await axios.all([
          categories,
          subCategories,
          subCategory,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setSubcategory(res3.data)
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  const handlerFilter = () => {
    const p = new Set(selectedProps);
    axios
      .get<IProduct[]>(`${process.env.NEXT_PUBLIC_API}/api/products/`, {
        params: {
          subcategory: pathname.split("/")[pathname.split("/").length - 1],
          props: selectedProps,
        },
      })
      .then((res: any) => {
        setSelectedProduct(res.data);
      })
      .catch((e: string) => console.log(e))
      .finally(() => {
        setLoad(false);
      });
  };

  if (!load && selectedProps) {
    return (
      <>
        <div className={styles.container}>
          <TopHeader />
          <Header />
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.phone}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Телефоны</h1>
          </div>
          <section className={styles.cardSection}>
            <div className={styles.cardBurgerg} onClick={cardBurgerHandler}>
              <h3>Фильтр</h3>
              <Image
                src={"/rightArrow.svg"}
                width={24}
                height={24}
                alt="arrow"
              />
            </div>
            {cardBurger && (
              <CardBurger
                setCardBurger={setCardBurger}
                cardBurger={cardBurger}
                selectedProps={selectedProps}
                setSelectedProps={setSelectedProps}
                handlerFilter={handlerFilter}
                subcategor={subcategor}
              />
            )}

            <CategoryProp
              selectedProps={selectedProps}
              setSelectedProps={setSelectedProps}
              handlerFilter={handlerFilter}
              subcategor={subcategor}
              selectedProduct={selectedProduct}
            />

            <section className={styles.sectionRight}>
              {selectedProduct &&
                selectedProduct.products.map((e, index: number) => (
                  <Card
                    animation="fade-down"
                    url={e.id}
                    height={300}
                    width={300}
                    image={
                      e.media.length
                        ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[1]?.name}`
                        : "/images/14.png"
                    }
                    title={e.name}
                    // @ts-ignore
                    price={e.price[0].price}
                    key={e.id}
                    isLiked
                    likedObj={likedObj}
                    setLikedObj={setLikedObj}
                  />
                ))}
            </section>
          </section>
          <div className={styles.carusel}>
            <div
              style={{
                backgroundColor: "#E4B717",
                width: 39,
                height: 39,
                borderRadius: "100%",
                color: "#fff",
                textAlign: "center",
                paddingTop: 8,
              }}
            >
              <p>1</p>
            </div>
            <p>2</p>
            <p>3</p>
            <p>...</p>
            <p>5</p>
          </div>
          <div style={{ marginTop: -300 }}>
            <Footer />
          </div>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
}
