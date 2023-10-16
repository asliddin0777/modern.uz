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
  const [queue, setQueue] = useState<number | any>(0);
  const [timer, setTimer] = useState<number>(62);
  const [load, setLoad] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([])
  const [error, setError] = useState<string>("")
  const [err, setErr] = useState(false)

  const dum = queue === 2.5

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dum]);

  const path = usePathname()
  const numRef = useRef<HTMLInputElement | any>()
  const codeRef = useRef<HTMLInputElement | any>()
  const passRef = useRef<HTMLInputElement | any>()
  const passRef2 = useRef<HTMLInputElement | any>()
  const userNameRef = useRef<HTMLInputElement | any>()
  const lastNameRef = useRef<HTMLInputElement | any>()
  const [cookie, setCookie, removeCookie] = useCookies(['userInfo'])
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
          setError(err.response.data.errors[0].message)
          setErr(true)
          gotAfErr = err.response.data.errors[0].message
        }).then(res => {
          if (gotAfErr === "") {
            setQueue(2)
          }
        }).finally(() => {
          sessionStorage.setItem("userPhoneNumber", `998${numRef.current.value}`)
          numRef.current.value = null
        })
      } else {
        setError("Please enter number")
        setErr(true)
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
          code: "0000"
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          setCookie("userInfo", {
            userToken: res?.data.token,
          })
          setError("")
          setQueue(2.5)
          codeRef.current.value = null
        })
      }
    }
  }
  let errr = ""
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
          setCookie("userInfo", {
            userPhoneNumber: res.data.phoneNumber,
            userId: res.data.id,
            userToken: res.data.token,
          }, { path: "/" })
        }).catch((er) => {
          setError(er.response.data.errors[0].message)
          setErr(!err)
          errr = er.response.data.errors[0].message
        }).finally(() => {
          if (errr !== "") {
            removeCookie("userInfo")
            setQueue(0)
            passRef.current.value = null
            passRef2.current.value = null
          } else {
            push("/")
          }
        })
      } else {
        setError("The passwords are not same")
        setErr(!err)
      }
    }
  }
  const { userInfo } = cookie
  useEffect(() => {
    if (userInfo && userInfo.userId) {
      push("/")
    }
  })

  return (
    <>
      <Error err={err} msg={error} setErr={setErr} />
      <div className={styles.authent}>
        <div className={styles.auth}>
          <div className={styles.title}>
            <h3>
              {queue == 0 ? "Регистрация" : queue === 2 ? "Введите код" : queue === 2.5 ? "Новый пароль" : ""}
            </h3>
          </div>
          <div className={styles.authForm}>
            {queue === 0 ? <>
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
              {err === true && <p style={{
                color: "#f00"
              }}>{error}</p>}
              <button onClick={() => {
                handleUserGetCode()
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
                  {err === true && <p style={{
                    color: "#f00"
                  }}>{error}</p>}
                </> : ""}
          </div>
          {queue === 0 ? <button onClick={() => {
            push("/auth/login")
          }}>Уже есть аккаунт?</button> : ""}
        </div>
      </div>
    </>
  );
};

export default memo(Auth);
