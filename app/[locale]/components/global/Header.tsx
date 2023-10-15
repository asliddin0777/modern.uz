"use client";
import React, { memo, useEffect, useState } from "react";
import styles from "@/styles/head.module.css";
import Image from "next/image";
import Link from "next/link";
import Burger from "./Burger";
import useCookies from "react-cookie/cjs/useCookies";
import { IPage } from "@/interfaces/IPage";
import axios from "axios";
import IProduct from "@/interfaces/Product/IProduct";
import SearchModal from "./SearchModal";
import { useRouter } from "next/navigation";
interface IData {
  data?: IPage;
}

const Header = ({ data }: IData) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState<boolean | any>(false);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("/icons/ru.svg");
  const [nav, setNav] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [auth, setAuth] = useState<boolean>(false);
  const [fromWhere, setFromWhere] = useState<number>(1);
  const [load, setLoad] = useState(true)
  useEffect(() => {
    const handleScroll = () => {
      if (lastScrollPosition > 200) {
        const currentScrollPosition = window.pageYOffset;
        if (currentScrollPosition > lastScrollPosition && isHeaderVisible) {
          setIsHeaderVisible(false);
        } else if (
          currentScrollPosition < lastScrollPosition &&
          !isHeaderVisible
        ) {
          setIsHeaderVisible(true);
        }
        setLastScrollPosition(currentScrollPosition);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHeaderVisible, lastScrollPosition]);
  const handleScroll = (event: {
    preventDefault: Function
  }) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (products && products.length > 4) {
      document.addEventListener('scroll', handleScroll, { passive: false });

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const [cookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;
  const [products, setProducts] = useState<IProduct[]>([])
  const languges: string[] = ["/icons/uz.svg", "/icons/ru.svg"];
  const [liked, setLiked] = useState<number>(0)
  const [inCart, setInCart] = useState<number>(0)
  const [gotMsgs, setGotMsgs] = useState<number>(0)
  useEffect(() => {
    isBurgerOpen
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "auto");
  }, [isBurgerOpen]);

  useEffect(() => {
    if (auth === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await axios.get<IPage>(`${process.env.NEXT_PUBLIC_API}/api/products`)

        setProducts(products.data.products)
      } catch { } finally {
        () => {
          setLoad(false)
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        try {
          const liked = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/products/liked`, {
            headers: {
              Authorization: userInfo === undefined ? "" : userInfo.userToken
            }
          })
          const cart = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/api/users/current`,
            {
              headers: {
                Authorization: userInfo === undefined ? "" : userInfo.userToken,
              },
            }
          );
          const unreadMsg = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats/user/msgcount`, {
            headers: {
              Authorization: userInfo !== undefined ? userInfo.userToken : ""
            }
          })
          setGotMsgs(unreadMsg.data.unreadMsgs)
          setLiked(liked.data.length)
          setInCart(cart.data.basket.length)
        } finally { }
      }
      fetchData()
    }
  })

  function disableScroll() {
    const handleScroll = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    };

    useEffect(() => {
      document.addEventListener('scroll', handleScroll, { passive: false });

      return () => {
        document.removeEventListener('scroll', handleScroll);
      };
    }, []);
  }
  disableScroll()
  const [searchTerm, setSearchTerm] = useState('');
  const [foundVal, setFoundVal] = useState<IProduct[]>()
  const handleSearch = (event: {
    target: {
      value: string
    }
  }) => {
    setSearchTerm(event.target.value);
  };
  const {push} = useRouter()
  const handleSubmit = (e: {
    preventDefault: Function
  }) => {
    e.preventDefault()
    if (searchTerm.length !== 0) {
      const searchResults = products.filter((item) =>
        item.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
      );
      setFoundVal(searchResults)
    } else {
      setFoundVal([])
    }
  }
  useEffect(() => {
    if (auth === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [auth]);

  const changeBgHandler = () => {
    if (window.scrollY >= 16) {
      setNav(true);
    } else {
      setNav(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", changeBgHandler);
  }, []);
  return (
    <>
      <Burger products={products} isBurgerOpen={isBurgerOpen} setIsBurgerOpen={setIsBurgerOpen} />
      <header className={!nav ? styles.header : styles.headerNav}
        style={
          isHeaderVisible === true
            ? {
              transition: "0.3s",
              opacity: 1,
              transform: "translate3d(0px, 0px, 0px)",
            }
            : {
              opacity: 0,
              transform: "translate3d(0px, -113px, 0px)",
              transition: "0.3s",
            }
        }>
        <div onMouseLeave={() => {
          setMouseOver(false);
        }} className={styles.container}>
          <Link
            href={"/"}
            className={styles.logo}
            style={{
              color: "#E4B717",
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: 16,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              position: "relative",
            }}
          >
            <Image src={"/images/logo.png"} alt="logo" width={97} height={57} />{" "}
            <span
              style={{
                position: "relative",
                left: -16,
              }}
            >
              Modern shop
            </span>
          </Link>
          <form className={styles.search}>
            <input value={searchTerm} onChange={handleSearch} autoComplete="off" type="text" placeholder="Поиск" />
            <button onClick={handleSubmit}>
              <Image
                style={{
                  cursor: "pointer"
                }}
                src="/icons/search.svg"
                alt="search icon"
                width={22}
                height={22}
              />
            </button>
          </form>
          {/* <SearchModal products={foundVal ? foundVal : []} /> */}
          <div className={styles.contra}>
            <div
              onMouseOver={() => {
                setMouseOver(true);
              }}

              className={styles.contraLeft}
            >
              <div className={styles.image}>
                <Image src={language} width={30} height={30} alt="vdsdv" />
              </div>
              <div
                className={mouseOver ? styles.selectLanguage : styles.just}
                style={
                  !mouseOver
                    ? {
                      display: "none",
                    }
                    : {
                      marginTop: -23
                    }
                }
              >
                {languges.map((e: string) => {
                  return (
                    <div
                      key={e}
                      onClick={() => {
                        setLanguage(e);
                        setMouseOver(false);
                      }}
                    >
                      <Image src={e} width={25} height={25} alt="j" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.contraRight}>
              <div className={styles.image}>
                <Link href={"tel: + 998 93 059 59 37"}>
                <Image
                  src={"/icons/call.svg"}
                  alt="language icon"
                  width={20}
                  height={20}
                /></Link>
              </div>
              <Link href={"tel: + 998 93 059 59 37"} className={styles.call}>
                + 998 93 059 59 37
              </Link>
            </div>
            <div className={styles.ads}>
              <div onClick={() => {
                if (userInfo) {
                  setAuth(false);
                } else {
                  push("/auth/login")
                }
              }} className={styles.image}>
                {auth === false && userInfo ? <>
                  <Link className={styles.pushToURL} href="/liked">
                    <Image
                      src={"/icons/like.svg"}
                      alt="language icon"
                      width={20}
                      height={20}
                    />
                    {liked > 0 && <span className={styles.badge}>{liked}</span>}
                  </Link>
                </> : <Image
                  src={"/icons/like.svg"}
                  alt="language icon"
                  width={20}
                  height={20}
                />}
              </div>

              <div
                onClick={() => {
                  if (userInfo) {
                    setAuth(false);
                  } else {
                    push("/auth/login")
                  }
                }}
                className={styles.image}
              >
                {auth === false && userInfo ? <>
                  <Link className={styles.pushToURL} href="/cart" locale="ru">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 22 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.918457 1L3.11934 1.37995L4.13831 13.4889C4.21978 14.4778 5.04829 15.2367 6.04292 15.2335H17.5859C18.5351 15.2356 19.3403 14.539 19.4747 13.6018L20.4788 6.68031C20.591 5.90668 20.0524 5.18899 19.2779 5.07712C19.2101 5.06762 3.47275 5.06234 3.47275 5.06234"
                        stroke="#363636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.9546 8.96326H15.8887"
                        stroke="#363636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.57855 18.8921C5.89704 18.8921 6.15416 19.1496 6.15416 19.4662C6.15416 19.7839 5.89704 20.0415 5.57855 20.0415C5.26005 20.0415 5.00293 19.7839 5.00293 19.4662C5.00293 19.1496 5.26005 18.8921 5.57855 18.8921Z"
                        fill="#363636"
                        stroke="#363636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.5146 18.8921C17.8331 18.8921 18.0913 19.1496 18.0913 19.4662C18.0913 19.7839 17.8331 20.0415 17.5146 20.0415C17.1961 20.0415 16.939 19.7839 16.939 19.4662C16.939 19.1496 17.1961 18.8921 17.5146 18.8921Z"
                        fill="#363636"
                        stroke="#363636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {inCart > 0 && <span className={styles.badge}>{inCart}</span>}
                  </Link>
                </> : <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 22 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.918457 1L3.11934 1.37995L4.13831 13.4889C4.21978 14.4778 5.04829 15.2367 6.04292 15.2335H17.5859C18.5351 15.2356 19.3403 14.539 19.4747 13.6018L20.4788 6.68031C20.591 5.90668 20.0524 5.18899 19.2779 5.07712C19.2101 5.06762 3.47275 5.06234 3.47275 5.06234"
                      stroke="#363636"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.9546 8.96326H15.8887"
                      stroke="#363636"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.57855 18.8921C5.89704 18.8921 6.15416 19.1496 6.15416 19.4662C6.15416 19.7839 5.89704 20.0415 5.57855 20.0415C5.26005 20.0415 5.00293 19.7839 5.00293 19.4662C5.00293 19.1496 5.26005 18.8921 5.57855 18.8921Z"
                      fill="#363636"
                      stroke="#363636"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.5146 18.8921C17.8331 18.8921 18.0913 19.1496 18.0913 19.4662C18.0913 19.7839 17.8331 20.0415 17.5146 20.0415C17.1961 20.0415 16.939 19.7839 16.939 19.4662C16.939 19.1496 17.1961 18.8921 17.5146 18.8921Z"
                      fill="#363636"
                      stroke="#363636"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>}
              </div>
              <div
                onClick={() => {
                  if (userInfo) {
                    setAuth(false);
                  } else {
                    push("/auth/login")
                  }
                }}
                className={styles.image}
              >
                {auth === false && userInfo ? (
                  <Link className={styles.pushToURL} href="/chats" locale="ru">
                    <svg
                      viewBox="0 0 24.00 24.00"
                      width={24}
                      height={24}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                          stroke="#000000"
                          strokeWidth="0.792"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                    {gotMsgs > 0 && <span className={styles.badge}>{gotMsgs}</span>}
                  </Link>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24.00 24.00"
                      width={24}
                      height={24}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                          stroke="#000000"
                          strokeWidth="0.792"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </>
                )}
              </div>
              <button
                className={styles.image}
                onClick={() => {
                  setIsBurgerOpen(true);
                }}
              >
                <Image
                  src={"/icons/burger.svg"}
                  alt="language icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default memo(Header);
