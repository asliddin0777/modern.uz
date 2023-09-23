"use client";
import styles from "@/styles/profile.module.css";
import Image from "next/image";
import { useContext, useState } from "react";
import ChangePassword from "../components/local/ChangePassword";
import Categories from "../components/global/Categories";
import ProfileBurger from "../components/local/ProfileBurger";
import { useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import IUser from "@/interfaces/IUser";
import { useRouter } from "next/navigation";
import IProduct from "@/interfaces/Product/IProduct";
const Profile = () => {
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [profileBurger, setProfileBurger] = useState(false);
  const [button, setButton] = useState<number>(0);
  const { push } = useRouter();
  const [buttonColor, setButtonColor] = useState<number>(0);
  const [profile, setProfile] = useState<any | any[]>([]);
  const AuthOpen = () => {
    setIsChangePassOpen(!isChangePassOpen);
  };
  const [cookie, setCookie, removeCookie] = useCookies(["userInfo"]);
  const { userInfo } = cookie;
  const ProfileBurgerHandler = () => {
    setProfileBurger(!profileBurger);
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  });
  
  const [categories, setCategories] = useState<any[] | any>([]);
  const [subCategories, setSubCategories] = useState<any[] | any>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [user, setUser] = useState<IUser>();
  
  function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue
    
    var color = "rgb(" + r + ", " + g + ", " + b + ")";
    
    return color;
  }
  
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
        const user = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/users/current`,
          {
            headers: {
              Authorization: userInfo !== undefined && userInfo.userToken,
            },
          }
        );
        const [res1, res2, res3] = await axios.all([
          categories,
          subCategories,
          user,
        ]);
        setCategories(res1.data);
        setSubCategories(res2.data);
        setUser(res3.data);
        console.log(res3);
      } catch (err) {
        console.log(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);
  if (!load) {
    console.log(user);
    const userProfile: string[] | undefined = user?.fullName.split(" ");
    if (userInfo) {
      return (
        <div className={styles.profile}>
          {isChangePassOpen && (
            <ChangePassword setIsChangePassOpen={setIsChangePassOpen} />
          )}
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.profileTitle}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Профиль</h1>
            <div
              className={styles.profileBurger}
              onClick={ProfileBurgerHandler}
            >
              <Image
                src={"/icons/profileBurger.svg"}
                width={22}
                height={17}
                alt="burger"
              />
            </div>
            {profileBurger && (
              <ProfileBurger
                setButtonColor={setButtonColor}
                buttonColor={buttonColor}
              />
            )}
          </div>
          {buttonColor === 0 ? (
            <>
              <section className={styles.ProfileSection}>
                <section className={styles.profileLeft}>
                  <div className={styles.profileCard}>
                    <div
                      className={styles.profileUser}
                      style={
                        buttonColor !== 0
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(0);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "/icons/user.svg"
                            : "/icons/userWhite.svg"
                        }
                        width={16}
                        height={21}
                        alt="user"
                      />
                      <p>Личные данные</p>
                    </div>
                    <div
                      className={styles.profileOrder}
                      style={
                        // @ts-ignore
                        buttonColor !== 1
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(1);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "/icons/book.svg"
                            : "/icons/bookWhite.svg"
                        }
                        width={17.29}
                        height={21}
                        alt="book"
                      />
                      <p>Мои заказы</p>
                    </div>
                    <div
                      className={styles.profileClose}
                      onClick={() => {
                        removeCookie("userInfo");
                        push("/");
                        window.location.reload()
                      }}
                    >
                      <Image
                        src={"/icons/logout.svg"}
                        width={19}
                        height={19}
                        alt="close"
                      />
                      <p>Выйти</p>
                    </div>
                  </div>
                </section>
                <section className={styles.profileRight}>
                  <div
                    className={styles.profileImage}
                    style={{
                      background: `${getRandomColor()}`,
                    }}
                  >
                    {user && user.fullName[0]}
                  </div>
                  <div className={styles.inputSection}>
                    <div className={styles.input}>
                      <div>
                        <p>Имя</p>
                        <input
                          disabled
                          value={userProfile && userProfile[0]}
                          type="text"
                        />
                      </div>
                      <div>
                        <p>Фамилия</p>
                        <input
                          disabled
                          value={
                            userProfile && userProfile[userProfile.length - 1]
                          }
                          type="text"
                        />
                      </div>
                    </div>
                    <div className={styles.input}>
                      <div>
                        <p>Номер телефона</p>
                        <input
                          disabled
                          value={`+${user?.phoneNumber}`}
                          placeholder={`+${user?.phoneNumber}`}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.profileButton}>
                    <button onClick={AuthOpen}>Изменить пароль</button>
                    <button
                      style={{
                        marginLeft: 16,
                        backgroundColor: "#E4B717",
                        color: "#fff",
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                </section>
              </section>
            </>
          ) : (
            <>
              <section className={styles.ProfileSection}>
                <section className={styles.profileLeft}>
                  <div className={styles.profileCard}>
                    <div
                      className={styles.profileUser}
                      style={
                        buttonColor !== 0
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(0);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "/icons/userWhite.svg"
                            : "/icons/user.svg"
                        }
                        width={16}
                        height={21}
                        alt="user"
                      />
                      <p>Личные данные</p>
                    </div>
                    <div
                      className={styles.profileOrder}
                      style={
                        buttonColor !== 1
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(1);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "/icons/book.svg"
                            : "/icons/bookWhite.svg"
                        }
                        width={17.29}
                        height={21}
                        alt="book"
                      />
                      <p>Мои заказы</p>
                    </div>
                    <div
                      className={styles.profileClose}
                      onClick={() => {
                        removeCookie("userInfo");
                        push("/");
                      }}
                    >
                      <Image
                        src={"/icons/logout.svg"}
                        width={19}
                        height={19}
                        alt="close"
                      />
                      <p>Выйти</p>
                    </div>
                  </div>
                </section>
                <section className={styles.order}>
                  <h3 className={styles.orderTitle}>Мои заказы</h3>
                  {user && user.basket.length > 0 ? (
                    <>
                      <div className={styles.cardOrder}>
                        <div className={styles.orderNumber}>
                          <p>Товары</p>
                          <div className={styles.orderButton}>
                            <p>Статус: На рассмотрении</p>
                            <button>Заказ № 13</button>
                          </div>
                        </div>
                        <div className={styles.orderSection}>
                          <div>
                            {user &&
                              user.basket.map((e: IProduct, index: number) => {
                                return (
                                  <div key={e.id}>
                                    {" "}
                                    <div key={index} className={styles.cart}>
                                      <Image
                                        src={
                                          e.media?.length
                                            ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[1]?.name}`
                                            : "/images/14.png"
                                        }
                                        width={58}
                                        height={58}
                                        alt="hello"
                                        style={{
                                          width: "auto",
                                          height: 58,
                                        }}
                                      />
                                      <div className={styles.cartTitle}>
                                        <h3>{e.name}</h3>
                                        <div className={styles.const}>
                                          <div className={styles.constTag}>
                                            <p>Кол-во:</p>
                                            <p>{2}</p>
                                          </div>
                                          <div className={styles.priceTitle}>
                                            <p>Стоимость:</p>
                                            <p>{e.price[0].price}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.line}></div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className={styles.rightOrder}>
                            <div className={styles.total}>
                              <h4>Итого:</h4>
                              <h5></h5>
                            </div>
                            <div className={styles.button}>
                              <button>Связаться с продавцом</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <h1 style={{ textAlign: "center" }}>
                        You don't have products
                      </h1>
                    </>
                  )}
                </section>
              </section>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className={styles.profile}>
          {isChangePassOpen && (
            <ChangePassword setIsChangePassOpen={setIsChangePassOpen} />
          )}
          <Categories categories={categories} subcategories={subCategories} />
          <div className={styles.profileTitle}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Профиль</h1>
            <div
              className={styles.profileBurger}
              onClick={ProfileBurgerHandler}
            >
              <Image
                src={"/icons/profileBurger.svg"}
                width={22}
                height={17}
                alt="burger"
              />
            </div>
            {profileBurger && (
              <ProfileBurger
                setButtonColor={setButtonColor}
                buttonColor={buttonColor}
              />
            )}
          </div>
          {buttonColor === 0 ? (
            <section className={styles.ProfileSection}>
              <section className={styles.profileLeft}>
                <div className={styles.profileCard}>
                  <div
                    className={styles.profileUser}
                    style={
                      buttonColor !== 0
                        ? { backgroundColor: "#fff" }
                        : { backgroundColor: "#E4B717", color: "#fff" }
                    }
                    onClick={() => {
                      setButtonColor(0);
                    }}
                  >
                    <Image
                      src={
                      "/icons/user.svg"
                      }
                      width={16}
                      height={21}
                      alt="user"
                    />
                    <p>Личные данные</p>
                  </div>
                  <div
                    className={styles.profileOrder}
                    style={
                      // @ts-ignore
                      buttonColor !== 1
                        ? { backgroundColor: "#fff" }
                        : { backgroundColor: "#E4B717", color: "#fff" }
                    }
                    onClick={() => {
                      setButtonColor(1);
                    }}
                  >
                    <Image
                      src={
                        !buttonColor ? "icons/book.svg" : "icons/bookWhite.svg"
                      }
                      width={17.29}
                      height={21}
                      alt="book"
                    />
                    <p>Мои заказы</p>
                  </div>
                  <div
                    className={styles.profileClose}
                    onClick={() => {
                      removeCookie("userInfo");
                      push("/");
                    }}
                  >
                    <Image
                      src={"icons/logout.svg"}
                      width={19}
                      height={19}
                      alt="close"
                    />
                    <p>Выйти</p>
                  </div>
                </div>
              </section>
              <section className={styles.profileRight}>
                <h1 style={{ textAlign: "center" }}>
                  You dont have account yet!
                </h1>
              </section>
            </section>
          ) : (
            <>
              <section className={styles.ProfileSection}>
                <section className={styles.profileLeft}>
                  <div className={styles.profileCard}>
                    <div
                      className={styles.profileUser}
                      style={
                        buttonColor !== 0
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(0);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "icons/userWhite.svg"
                            : "icons/user.svg"
                        }
                        width={16}
                        height={21}
                        alt="user"
                      />
                      <p>Личные данные</p>
                    </div>
                    <div
                      className={styles.profileOrder}
                      style={
                        buttonColor !== 1
                          ? { backgroundColor: "#fff" }
                          : { backgroundColor: "#E4B717", color: "#fff" }
                      }
                      onClick={() => {
                        setButtonColor(1);
                      }}
                    >
                      <Image
                        src={
                          !buttonColor
                            ? "icons/book.svg"
                            : "icons/bookWhite.svg"
                        }
                        width={17.29}
                        height={21}
                        alt="book"
                      />
                      <p>Мои заказы</p>
                    </div>
                    <div className={styles.profileClose}>
                      <Image
                        src={"icons/logout.svg"}
                        width={19}
                        height={19}
                        alt="close"
                      />
                      <p>Выйти</p>
                    </div>
                  </div>
                </section>
                <section className={styles.order}>
                  <h3 className={styles.orderTitle}>Мои заказы</h3>
                  {user && user.basket.length > 0 ? (
                    <>
                      <div className={styles.cardOrder}>
                        <div className={styles.orderNumber}>
                          <p>Товары</p>
                          <div className={styles.orderButton}>
                            <p>Статус: На рассмотрении</p>
                            <button>Заказ № 13</button>
                          </div>
                        </div>
                        <div className={styles.orderSection}>
                          <div>
                            {user.basket.map((e, index: number) => {
                              return (
                                <div key={e.id}>
                                  {" "}
                                  <div key={index} className={styles.cart}>
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_IMAGE_API}/${e.media[0].name}`}
                                      width={58}
                                      height={58}
                                      style={{ width: "auto", height: 58 }}
                                      alt="hello"
                                    />
                                    <div className={styles.cartTitle}>
                                      <h3>{e.name}</h3>
                                      <div className={styles.const}>
                                        <div className={styles.constTag}>
                                          <p>Кол-во:</p>
                                          <p>{2}</p>
                                        </div>
                                        <div className={styles.priceTitle}>
                                          <p>Стоимость:</p>
                                          <p>{e.price[0].price}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.line}></div>
                                </div>
                              );
                            })}
                          </div>
                          <div className={styles.rightOrder}>
                            <div className={styles.total}>
                              <h4>Итого:</h4>
                              <h5>72.000.000 сум</h5>
                            </div>
                            <div className={styles.button}>
                              <button>Связаться с продавцом</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <h1 style={{ textAlign: "center" }}>
                        You don't have products
                      </h1>
                    </>
                  )}
                </section>
              </section>
            </>
          )}
        </div>
      );
    }
  }
};

export default Profile;
