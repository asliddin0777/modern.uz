"use client"
import React, { Ref, RefAttributes, useEffect, useRef, useState } from "react";
import styles from "@/styles/auth.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";



interface Auth {
  setIsAuthOpen: Function;
  isAuthOpen: boolean;
  fromWhere: number
  setFromWhere: Function
}

const Auth = ({ setIsAuthOpen, isAuthOpen, fromWhere, setFromWhere }: Auth) => {

  const [queue, setQueue] = useState<number | any>(0);
  const [timer, setTimer] = useState<number>(62);
  const [load, setLoad] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([])

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

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
  const [startDate, setStartDate] = useState(new Date());

  const [] = useState<string>()

  const [cookie, setCookie] = useCookies(['userInfo'])
  const handleCheckUserAtLogin = () => {
    if (passwordRef && numberRef) {
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
      }).catch(err => console.log(err))
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
        }).then((res) => console.log(res)).catch(err => console.log(err))
        setFromWhere(0)
        setQueue(2)
        sessionStorage.setItem("userPhoneNumber", `998${numRef.current.value}`)
        numRef.current.value = null
      }
    } else {
      alert("Fill the blank")
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
        localStorage.setItem("userName", userNameRef.current.value)
        localStorage.setItem("lastname", lastNameRef.current.value)
        localStorage.setItem("password", passRef.current.value)
        setFromWhere(0)
        setIsAuthOpen(false)
        passRef.current.value = null
        passRef2.current.value = null
      } else {
        alert("They are not same")
      }
    }
  }


  return (
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
              <input
                type="text"
                maxLength={9}
                placeholder="Номер телефона"
                required
                ref={numberRef}
                autoComplete="false"
              />
              <input
                type="password"
                maxLength={8}
                placeholder="Пароль"
                required
                ref={passwordRef}
                autoComplete={"false"}
              />
              <button
                className={styles.forgotPass}
                onClick={() => {
                  setQueue(2);
                }}
              >
                Вы забыли пароль?
              </button>
              <button className={styles.enter} onClick={() => {
                if (passwordRef.current.value && numberRef.current.value) {
                  handleCheckUserAtLogin()
                }
              }}>Войти</button>
            </>
          ) : fromWhere === 2 ? <>
            <input
              type="text"
              maxLength={9}
              placeholder="Номер телефона"
              required
              ref={numRef}
              autoComplete="false"
            />
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
                autoComplete="false"
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
                  autoComplete="false"
                />
                <input
                  type="text"
                  maxLength={20}
                  placeholder="Фамилия"
                  required
                  ref={lastNameRef}
                  autoComplete="false"
                />
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Новый пароль"
                  required
                  ref={passRef}
                  autoComplete="false"
                />
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Подтвердите пароль"
                  required
                  ref={passRef2}
                  autoComplete="false"
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
  );
};

export default Auth;
