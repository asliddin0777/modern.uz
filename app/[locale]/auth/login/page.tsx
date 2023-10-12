"use client"
import React, { memo, useEffect, useRef, useState } from "react";
import styles from "@/styles/auth.module.css";
import Image from "next/image";
import axios from "axios";
import { useCookies } from "react-cookie";
import Error from "../../components/local/Error";
import { usePathname, useRouter } from "next/navigation";
import Success from "../../components/local/Success";

const Auth = () => {
  const { refresh, push } = useRouter()
  const [timer, setTimer] = useState<number>(62);
  const [error, setError] = useState<string>("")
  const [err, setErr] = useState(false)

  const passwordRef = useRef<HTMLInputElement | any>()
  const numberRef = useRef<HTMLInputElement | any>()
  const numRef = useRef<HTMLInputElement | any>()
  const codeRef = useRef<HTMLInputElement | any>()
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
        }, {path: "/"})
        refresh()
      }).catch(err => {
        setError(err.response.data.errors[0].message);
        setErr(true)
        gotAfErr = "ewfwefwef"
      }).finally(()=> {
        if (gotAfErr === "") {
          push("/")
        }
      })
    }
  }
  let gotAfErr = ""
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
          console.log(err);
          setError(err.response.data.errors[0].message)
          setErr(true)
          gotAfErr = err.response.data.errors[0].message
        }).finally(() => {
          sessionStorage.setItem("userPhoneNumber", `998${numRef.current.value}`)
          numRef.current.value = null
        })
      }
    } else {
      setError("Fill the blanks")
    }
  }

  return (
    <div className={styles.authent}>
      <div className={styles.auth}>
        <div className={styles.title}>
          <h3>Авторизация</h3>
        </div>
        <div className={styles.authForm}>
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
            className={styles.forgotPass}>
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
        </div>
        <button onClick={() => {
          push("/auth/register")
        }}>Регистрация</button>
      </div>
    </div>
  )
};

export default memo(Auth);
