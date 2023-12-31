"use client";
import styles from "@/styles/category.module.css";
import Image from "next/image";
import Card from "../../components/global/Card";
import { useState, useEffect, memo } from "react";
import Categories from "../../components/global/Categories";
import CardBurger from "../../components/local/CardBurger";
import axios from "axios";
import Loader from "../../components/local/Loader";
import { usePathname } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
import CategoryProp from "../../components/local/CategoryProp";

const Page = ({ searchParams }: {
  searchParams: {
    id: string
  }
}) => {
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
  const pathname = usePathname();
  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/api/products`, {
        params: {
          category: searchParams.id,
        },
      })
      .then((res: any) => {
        setSelectedProduct(res.data);
      })
      .finally(() => {
        setLoad(false);
      });
  }, [data]);

  useEffect(() => {
    setLoad(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/api/subcategories/${searchParams.id}`
      )
      .then((res: any) => {
        setSubcategory(res.data);
      })
      .finally(() => {
        setLoad(false);
      });
  }, []);

  console.clear()

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
        const [res1, res2] = await axios.all([categories, subCategories]);
        setCategories(res1.data);
        setSubCategories(res2.data);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  const handlerFilter = () => {
    axios
      .get<IProduct[]>(`${process.env.NEXT_PUBLIC_API}/api/products/`, {
        params: {
          subcategory: searchParams.id,
          props: selectedProps,
        },
      })
      .then((res: any) => {
        setSelectedProduct(res.data);
      })
      .finally(() => {
        setLoad(false);
      });
  };
  if (!load && subCategories) {
    return (
      <>
        <div className={styles.container} style={{
          marginBottom: "3rem"
        }}>
          <Categories categories={categories} subcategories={subCategories} />
          {Categories && Categories.name &&
            <div className={styles.phone}>
              <h1>
                {Categories.name}
              </h1>
            </div>}
          <section className={styles.cardSection}>
            {subcategor && <>
              {/* <div className={styles.cardBurgerg} onClick={cardBurgerHandler}>
                <h3>Фильтр</h3>
              </div>
              {cardBurger && (
                <>
                  <CardBurger
                    setCardBurger={setCardBurger}
                    cardBurger={cardBurger}
                    selectedProps={selectedProps}
                    setSelectedProps={setSelectedProps}
                    handlerFilter={handlerFilter}
                    subcategor={subcategor}
                  /></>
              )} */}

              <CategoryProp
                selectedProps={selectedProps}
                setSelectedProps={setSelectedProps}
                handlerFilter={handlerFilter}
                subcategor={subcategor}
                selectedProduct={selectedProduct}
              /></>
            }

            <section className={styles.sectionRight}>
              {selectedProduct && selectedProduct.products &&
                selectedProduct.products.map((e, index: number) => (
                  <Card
                    card={e}
                    animation="fade-down"
                    url={e.id}
                    height={300}
                    setData={setData}
                    width={300}
                    cat={e.subcategory.name}
                    image={
                      e.media.length
                        ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[0]?.name}`
                        : "/images/noImg.jpg"
                    }
                    title={e.name}
                    price={String(e.price[0].price)}
                    key={e.id}
                    isLiked
                    likedObj={likedObj}
                    setLikedObj={setLikedObj}
                    subcategor={subcategor}
                  />
                ))}
            </section>
          </section>
        </div>
      </>
    );
  } else {
    return <Loader />;
  }
}

export default memo(Page)
