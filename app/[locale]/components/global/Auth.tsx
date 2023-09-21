"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/auth.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import Error from "../local/Error";
import { useRouter } from "next/navigation";



interface Auth {
  setIsAuthOpen: Function;
  isAuthOpen: boolean;
  fromWhere: number
  setFromWhere: Function
}

const Auth = ({ setIsAuthOpen, isAuthOpen, fromWhere, setFromWhere }: Auth) => {
  const { refresh } = useRouter()
  const [queue, setQueue] = useState<number | any>(0);
  const [timer, setTimer] = useState<number>(62);
  const [load, setLoad] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([])
  const [error, setError] = useState<string>("")
  const [err, setErr] = useState(false)

  useEffect(() => {
    if (isAuthOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isAuthOpen]);

  const dum = queue === 2.5

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dum]);


  const phoneRef = useRef<HTMLInputElement | any>()
  const msgPassRef = useRef<HTMLInputElement | any>()

  const passwordRef = useRef<HTMLInputElement | any>()
  const numberRef = useRef<HTMLInputElement | any>()
  const numRef = useRef<HTMLInputElement | any>()
  const codeRef = useRef<HTMLInputElement | any>()
  const passRef = useRef<HTMLInputElement | any>()
  const passRef2 = useRef<HTMLInputElement | any>()
  const userNameRef = useRef<HTMLInputElement | any>()
  const lastNameRef = useRef<HTMLInputElement | any>()
  const [cookie, setCookie] = useCookies(['userInfo'])
  const handleCheckUserAtLogin = () => {
    if (passwordRef.current.value !== "" && numberRef.current.value !== "") {
      axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/login`, {
        phoneNumber: `998${numberRef?.current?.value}`,
        password: `${passwordRef?.current?.value}`,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res: any) => {
        setCookie("userInfo", {
          userPhoneNumber: res.data.phoneNumber,
          userId: res.data.id,
          userToken: res.data.token,
        })
        setIsAuthOpen(false)
        refresh()
      }).catch(err => {
        console.log(err);
        setError(err.response.data.errors[0].message);
        setErr(true)
      })
    }
  }

  const handleUserGetCode = () => {
    if (numRef && numRef.current) {
      const isNumber = /\d/.test(numRef.current.value)
      if (isNumber === true) {
        axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/get-code`, {
          phoneNumber: `998${numRef.current.value}`
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }).catch(err => {
          console.log(err.response.data);
          //setError(err.response.data.errors[0].message)
        })
        setFromWhere(0)
        setQueue(2)
        sessionStorage.setItem("userPhoneNumber", `998${numRef.current.value}`)
        numRef.current.value = null
        setError("The OTC is incorrect")
      }
    } else {
      setError("Fill the blanks")
    }
  }


  const handleUserRegister = () => {
    if (codeRef && codeRef.current) {
      const isNumber = /\d/.test(codeRef.current.value)
      if (isNumber === true) {
        axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/verify`, {
          phoneNumber: sessionStorage.getItem("userPhoneNumber"),
          code: codeRef.current.value
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }).catch(err => console.log(err)).then(res => setCookie("userInfo", {
          userToken: res?.data.token,
        }))
        setQueue(2.5)
        codeRef.current.value = null
      }
    }
  }

  const handleCreatePassword = () => {
    if (passRef.current && passRef2.current && lastNameRef.current && userNameRef.current) {
      if (passRef.current.value === passRef2.current.value) {
        axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/register`, {
          password: passRef.current.value,
          phoneNumber: sessionStorage.getItem("userPhoneNumber"),
          fullName: `${userNameRef.current.value} ${lastNameRef.current.value}`
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: cookie.userInfo.userToken
          }
        }).then((res) => {
          console.log(res);
          setCookie("userInfo", {
            userPhoneNumber: res.data.phoneNumber,
            userId: res.data.id,
            userToken: res.data.token,
          })
        }).catch(err => console.log(err))
        setFromWhere(0)
        setIsAuthOpen(false)
        passRef.current.value = null
        passRef2.current.value = null
      } else {
        setError("The passwords are not same")
      }
    }
  }


  return (
    <>
      {error !== "" && <Error err={err} setErr={setErr} msg={error} />}
      <div className={isAuthOpen ? styles.authent : styles.dn}>
        <div className={isAuthOpen ? styles.auth : styles.dn}>
          <div className={styles.close}>
            <button
              onClick={() => {
                setIsAuthOpen(false);
              }}
            >
              <Image
                src={"/icons/close.svg"}
                alt="close auth icon"
                width={21}
                height={21}
              />
            </button>
          </div>
          <div className={styles.title}>
            <h3>
              {fromWhere === 1
                ? "Авторизация"
                : fromWhere === 2 ? "Регистрация" : queue === 2 ? "Введите код" : queue === 2.5 ? "Новый пароль" : ""}
            </h3>
          </div>
          <div className={styles.authForm}>
            {fromWhere === 1 ? (
              <>
                <div className={styles.phoneNumber}>
                  <p>+998</p>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="999999999"
                    required
                    ref={numberRef}
                    autoComplete="off"
                  />
                </div>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Пароль"
                  required
                  ref={passwordRef}
                  autoComplete={"off"}
                />
                <button
                  className={styles.forgotPass}
                  onClick={() => {
                    setQueue(2);
                  }}
                >
                  Вы забыли пароль?
                </button>
                <button className={styles.enter} onClick={(e) => {
                  if (passwordRef.current.value && numberRef.current.value) {
                    handleCheckUserAtLogin()
                  } else {
                    setErr(true)
                    setError("Please fill the blanks")
                  }
                }}>Войти</button>
              </>
            ) : fromWhere === 2 ? <>
              <div className={styles.phoneNumber}>
                <p>+998</p>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="999999999"
                  required
                  ref={numRef}
                  autoComplete="off"
                />
              </div>
              <button onClick={() => {
                handleUserGetCode()
                // console.log("object");
              }} className={styles.enter}>Подтвердить</button>
            </> : queue === 2 ?
              <>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Код"
                  required
                  ref={codeRef}
                  autoComplete="off"
                />
                <button onClick={() => {
                  handleUserRegister()
                }} className={styles.enter}>Подтвердить</button>
                <p onClick={() => {
                  timer <= 0 ? setTimer(60) : ""
                }} style={timer <= 0 ? {
                  textAlign: "center",
                  color: 'red',
                  cursor: "pointer"
                } : {
                  textAlign: "center",
                  cursor: "pointer"
                }}>Запросить еще раз ( 0 : {timer <= 0 ? 0 : timer} )</p>
              </> : queue === 2.5 ?
                <>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Имя"
                    required
                    ref={userNameRef}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Фамилия"
                    required
                    ref={lastNameRef}
                    autoComplete="off"
                  />
                  <input
                    type="password"
                    minLength={8}
                    maxLength={36}
                    placeholder="Новый пароль"
                    required
                    ref={passRef}
                    autoComplete="off"
                  />
                  <input
                    type="password"
                    minLength={8}
                    maxLength={36}
                    placeholder="Подтвердите пароль"
                    required
                    ref={passRef2}
                    autoComplete="off"
                  />
                  <button onClick={() => {
                    handleCreatePassword()
                  }} className={styles.enter}>Подтвердить</button>
                </> : ""}
          </div>
          {fromWhere === 1 ? <button onClick={() => {
            setFromWhere(2)
          }}>Регистрация</button> : fromWhere === 2 ? <button onClick={() => {
            setFromWhere(1)
          }}>Уже есть аккаунт?</button> : ""}
        </div>
        <div
          className={styles.bg}
          onClick={() => {
            setIsAuthOpen(false);
          }}
        />

      </div>
    </>
  );
};

export default Auth;
